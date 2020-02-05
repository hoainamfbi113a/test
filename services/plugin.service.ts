import { Model } from "BaseService/db/Model";
import {
  GetAllSchema,
  IGetAllInput,
} from "BaseService/services/base.validator";
import { IPlugin } from "Interfaces";
import Knex = require("knex");
import { Context, ServiceSchema, ServiceSettingSchema } from "moleculer";
import { Action } from "moleculer-decorators";
import {
  ModelMstPlugin,
  ModelOrgPlugin,
  MstPlugin,
  OrgPlugin,
} from "../src/models";

class PluginService implements ServiceSchema {
  public name: string = "plugin";
  public dependencies: string[] = ["user"];
  public settings: ServiceSettingSchema = {
    rest: this.name,
  };
  @Action({
    params: GetAllSchema,
    rest: {
      method: "GET",
      path: "/getAllMaster",
    },
  })
  public async getAllMaster(
    ctx: Context<IGetAllInput>,
  ): Promise<IPlugin.IGetMstPluginOutput[]> {
    const model = new ModelMstPlugin(ctx, null, true);
    const params = ctx.params;
    return await model.queryByConditions(
      params.where,
      params.order,
      params.pageSize,
      params.pageIndex,
    );
  }

  @Action({
    params: IPlugin.GetPluginInputSchema,
    rest: "GET /getOrgPlugins",
  })
  public async getOrgPlugins(
    ctx: Context<IPlugin.IGetOrgPluginInput>,
  ): Promise<IPlugin.IGetOrgPluginOutput[]> {
    const model = new ModelOrgPlugin(ctx);
    const params: IPlugin.IGetOrgPluginInput = ctx.params || {
      page: 1,
      pageSize: 20,
      transaction: null,
    };
    const offset = (params.page - 1) * params.pageSize;
    return await model.getAllActiveOrgPlugins(params.pageSize, offset, [
      "name",
      "key",
    ]);
  }

  @Action({
    params: IPlugin.CreateMstPluginInputSchema,
    rest: "POST createMasterPlugin",
  })
  public async createMasterPlugin(
    ctx: Context<IPlugin.ICreateMstPluginInput>,
  ): Promise<IPlugin.ICreateMstPluginOutput> {
    let result: any = null;
    const model = new Model(ctx, null, true);
    await model
      .openTransaction(async (trx: Knex.Transaction) => {
        const mstModel = new ModelMstPlugin(ctx, trx, true);
        const data = new MstPlugin();
        data.name = ctx.params.name;
        data.key = ctx.params.key;
        result = (await mstModel.insert(data)).map((p) => {
          return {
            id: p.id,
            key: p.key,
            name: p.name,
          } as IPlugin.ICreateMstPluginOutput;
        });
      })
      .then((value) => {})
      .catch((error) => {
        throw error;
      });
    return result;
  }

  @Action({
    params: IPlugin.UpdateMstPluginInputSchema,
    rest: "PUT updateMasterPlugin",
  })
  public async updateMasterPlugin(
    ctx: Context<IPlugin.IUpdateMstPluginInput>,
  ): Promise<IPlugin.IUpdateMstPluginOutput> {
    const model = new ModelMstPlugin(ctx, null, true);
    let result: any = null;
    await model.openTransaction(async (trx: Knex.Transaction) => {
      const data = new MstPlugin();
      data.id = ctx.params.id;
      data.name = ctx.params.name;
      data.key = ctx.params.key;
      result = (await model.findAndUpdate(data.id, data)).map((p) => {
        return {
          id: p.id,
          key: p.key,
          name: p.name,
        } as IPlugin.IUpdateMstPluginOutput;
      });
    });
    return result;
  }

  @Action({
    rest: "POST addOrgPlugin",
  })
  public async addOrgPlugin(
    ctx: Context<IPlugin.IAddOrgPluginInput, any>,
  ): Promise<IPlugin.IAddOrgPluginOutput> {
    const pluginId = ctx.params.pluginId;
    const model = new ModelMstPlugin(ctx);

    const isValid = await model.isValidPlugin(pluginId);
    if (!isValid) {
      throw new Error(`Plugin ID ${pluginId} is invalid`);
    }
    const orgPluginModel = new ModelOrgPlugin(ctx);
    let result = null;
    await model.openTransaction(async (trx: Knex.Transaction) => {
      const data = new OrgPlugin();
      data.org_id = ctx.meta.orgInfo.id;
      data.plugin_id = pluginId;
      result = orgPluginModel.insert(data);
    });
    return result;
  }

  @Action({
    rest: "DELETE removeOrgPlugin/:pluginId",
  })
  public async removeOrgPlugin(
    ctx: Context<IPlugin.IRemoveOrgPluginInput>,
  ): Promise<IPlugin.IRemoveOrgPluginOutput> {
    const pluginId = ctx.params.pluginId;
    const model = new ModelOrgPlugin(ctx);
    let result = null;
    await model.openTransaction(async (trx: Knex.Transaction) => {
      result = model.removeOrgPlugins(pluginId);
    });
    return result;
  }

  @Action({
    params: IPlugin.DeleteMstPluginInputSchema,
    rest: "DELETE deleteMasterPlugin/:id",
  })
  public async deleteMasterPlugin(
    ctx: Context<IPlugin.IDeletePluginInput>,
  ): Promise<IPlugin.IDeletePluginOutput> {
    const model = new ModelMstPlugin(ctx, null, true);
    let result: any = null;
    await model.openTransaction(async (trx: Knex.Transaction) => {
      result = await model.deleteByPrimaryKey(ctx.params.id, ["id"]);
    });
    return result;
  }
}

module.exports = new PluginService();
