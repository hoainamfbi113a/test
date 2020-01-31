//#region Global Imports
import { Model } from "base-service/dist/db/Model";
import * as fs from "fs";
import * as path from "path";
import { IFile } from "Interfaces";
import { Context, ServiceSchema } from "moleculer";
import { Action } from "moleculer-decorators";
import { FileUpload, ModelFileUpload } from "../src/models/ModelFileUpload";
import uuid = require("uuid");

class FileService implements ServiceSchema {
  public name: string = "file";

  @Action()
  public async upload(ctx: Context<any>): Promise<any> {
    let result = null;
    if (!ctx.meta.orgInfo || !ctx.meta.orgInfo.id) {
      return false;
    }
    let fileData: any = null;
    await ctx.params.on("data", (data: any) => {
      fileData = data;
    });
    if (!fileData) {
      return false;
    }
    const baseModel = new Model(ctx);
    const directory = `${process.cwd()}/public/uploads/${ctx.meta.orgInfo.id}`;
    const fileName = ctx.meta.filename
      ? `${uuid.v4()}.${ctx.meta.filename}`
      : uuid.v4();
    await baseModel
      .openTransaction(async (trx: any) => {
        const fileUploadModel = new ModelFileUpload(ctx, trx);
        const fileUpload = new FileUpload();
        fileUpload.file_name = fileName;
        fileUpload.physical_path = `${directory}/${fileName}`;
        fileUpload.relative_url = path.relative("./", fileUpload.physical_path);
        result = (await fileUploadModel.insert(fileUpload, ["*"]))[0];
        fs.mkdirSync(directory, { recursive: true });
        fs.writeFileSync(fileUpload.physical_path, fileData);
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
}

module.exports = new FileService();
