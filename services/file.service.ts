//#region Global Imports
import { Model } from "BaseService/db/Model";
import * as fs from "fs";
import * as path from "path";
const fsExtra = require("fs-extra");
import { IFile } from "Interfaces";
import { Context, ServiceSchema } from "moleculer";
import { Action, Method } from "moleculer-decorators";
import uuid = require("uuid");
import { FileUpload, ModelFileUpload } from "../src/models/ModelFileUpload";
import { getTargetUploadPath } from "../src/utilities/uploads";

class FileService implements ServiceSchema {
  public name: string = "file";

  @Action()
  public async upload(ctx: Context<any, any>): Promise<any> {
    let result = null;
    if (!ctx.meta.orgInfo || !ctx.meta.orgInfo.id || !ctx.meta.filename) {
      await ctx.params.on("data", (data: any) => {});
      return false;
    }

    const baseModel = new Model(ctx);
    const directory = `${process.cwd()}/public/temp/${ctx.meta.orgInfo.id}`;
    const fileName = ctx.meta.filename
      ? `${uuid.v4()}.${ctx.meta.filename}`
      : uuid.v4();
    await baseModel
      .openTransaction(async (trx: any) => {
        const fileUploadModel = new ModelFileUpload(ctx, trx);
        const fileUpload = new FileUpload();
        fileUpload.file_name = fileName;
        fileUpload.physical_path = `${directory}/${fileName}`;
        fileUpload.relative_url = `/${path.relative(
          "./public",
          fileUpload.physical_path,
        )}`;
        result = (await fileUploadModel.insert(fileUpload, ["*"]))[0];
        fs.mkdirSync(directory, { recursive: true });
        const writableStream = fs.createWriteStream(fileUpload.physical_path);
        ctx.params.pipe(writableStream);
        await ctx.params.on("data", (data: any) => {});
      })
      .catch((error) => {
        result = false;
      });

    return result;
  }

  @Action({
    params: IFile.DeleteFileSchema,
  })
  public async delete(ctx: Context<any>): Promise<any> {
    const baseModel = new Model(ctx);
    let results = null;
    await baseModel
      .openTransaction(async (trx: any) => {
        const fileUploadModel = new ModelFileUpload(ctx, trx);
        const query = fileUploadModel
          .query()
          .where({ is_deleted: false })
          .update({ is_deleted: true, updated_at: "NOW()" }, "*");
        if (ctx.params.ids) {
          query.whereIn("id", ctx.params.ids);
        } else if (ctx.params.fileNames) {
          query.whereIn("file_name", ctx.params.fileNames);
        } else {
          throw new Error("Request params is invalid");
        }
        const files = await query;
        if (files && files.length > 0) {
          for (const file of files) {
            if (fs.existsSync(file.physical_path)) {
              fs.unlinkSync(file.physical_path);
            }
          }
        }
        results = files;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
    return results;
  }

  @Action({
    visibility: "public",
  })
  private async moveImage(ctx: any) {
    const { imgDir, imgName, target, pathArr = [] } = ctx.params;
    const orgId = ctx.meta.orgInfo.id;
    const imgPath = `${process.cwd()}/public${imgDir}`;
    const newImagePath = `/${getTargetUploadPath(
      orgId,
      target,
      pathArr,
    )}/${imgName}`;
    await fsExtra
      .copy(imgPath, `${process.cwd()}/public${newImagePath}`)
      .then(() => {
        fsExtra.removeSync(imgPath);
      })
      .catch((err: any) => {
        console.error(err);
        throw new Error("Can't move image");
      });

    return {
      newPath: newImagePath,
      oldPath: imgPath,
    };
  }
}

module.exports = new FileService();
