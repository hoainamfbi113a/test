
import Knex = require("knex");
import { Context, ServiceSchema } from "moleculer";
import { Action } from "moleculer-decorators";
import { IPlugin } from 'Interfaces';
import { ModelMstPlugin, ModelOrgPlugin, MstPlugin, OrgPlugin } from "../src/models";
import { Model } from "BaseService/db/Model";
import { GetAllSchema, IGetAllInput } from "BaseService/services/base.validator";

class PluginService implements ServiceSchema {
	public name: string = 'api/plugin';
	public dependencies: Array<string> = ['user'];

	@Action({
		params: GetAllSchema,
		rest: 'GET /getAllMaster'
	})
	public async getAllMaster(ctx: Context<IGetAllInput>): Promise<IPlugin.IGetMstPluginOutput[]> {
		let model = new ModelMstPlugin(ctx, null, true);
		let params = ctx.params
		return await model.queryByConditions(params.where, params.order, params.pageSize, params.pageIndex);
	}

	@Action({
		params: IPlugin.GetPluginInputSchema,
		rest: 'GET /getOrgPlugins'
	})
	public async getOrgPlugins(ctx: Context<IPlugin.IGetOrgPluginInput>): Promise<IPlugin.IGetOrgPluginOutput[]> {
		let model = new ModelOrgPlugin(ctx);
		let params: IPlugin.IGetOrgPluginInput = ctx.params || {
			page: 1,
			pageSize: 20,
			transaction: null
		};
		let offset = (params.page - 1) * params.pageSize;
		return await model.getAllActiveOrgPlugins(params.pageSize, offset, ['name', 'key']);
	}

	@Action({
		params: IPlugin.CreateMstPluginInputSchema,
		rest: 'POST createMasterPlugin'
	})
	public async createMasterPlugin(ctx: Context<IPlugin.ICreateMstPluginInput>): Promise<IPlugin.ICreateMstPluginOutput> {
		let result: any = null;
		let model = new Model(ctx, null, true);
		await model.openTransaction(async (trx: Knex.Transaction) => {
			let mstModel = new ModelMstPlugin(ctx, trx, true);
			let data = new MstPlugin();
			data.name = ctx.params.name;
			data.key = ctx.params.key;
			result = (await mstModel.insert(data))
				.map(p => { return <IPlugin.ICreateMstPluginOutput>{ id: p.id, name: p.name, key: p.key } });
		}).then((value) => { }).catch((error) => {
			throw error;
		});
		return result;
	}

	@Action({
		params: IPlugin.UpdateMstPluginInputSchema,
		rest: 'PUT updateMasterPlugin'
	})
	public async updateMasterPlugin(ctx: Context<IPlugin.IUpdateMstPluginInput>): Promise<IPlugin.IUpdateMstPluginOutput> {
		let model = new ModelMstPlugin(ctx, null, true);
		let result: any = null;
		await model.openTransaction(async (trx: Knex.Transaction) => {
			let data = new MstPlugin();
			data.id = ctx.params.id;
			data.name = ctx.params.name;
			data.key = ctx.params.key;
			result = (await model.findAndUpdate(data.id, data))
				.map(p => { return <IPlugin.IUpdateMstPluginOutput>{ id: p.id, name: p.name, key: p.key } });
		});
		return result;
	}

	@Action({
		rest: 'POST addOrgPlugin'
	})
	public async addOrgPlugin(ctx: Context<IPlugin.IAddOrgPluginInput>): Promise<IPlugin.IAddOrgPluginOutput> {
		let pluginId = ctx.params.pluginId;
		let model = new ModelMstPlugin(ctx);

		let isValid = await model.isValidPlugin(pluginId);
		if (!isValid) {
			throw `Plugin ID ${pluginId} is invalid`;
		}
		let orgPluginModel = new ModelOrgPlugin(ctx);
		let result = null;
		await model.openTransaction(async (trx: Knex.Transaction) => {
			let data = new OrgPlugin();
			data.org_id = ctx.meta.orgInfo.id;
			data.plugin_id = pluginId;
			result = orgPluginModel.insert(data);
		});
		return result;
	}

	@Action({
		rest: 'DELETE removeOrgPlugin/:pluginId'
	})
	public async removeOrgPlugin(ctx: Context<IPlugin.IRemoveOrgPluginInput>): Promise<IPlugin.IRemoveOrgPluginOutput> {
		let pluginId = ctx.params.pluginId;
		let model = new ModelOrgPlugin(ctx);
		let result = null;
		await model.openTransaction(async (trx: Knex.Transaction) => {
			result = model.removeOrgPlugins(pluginId);
		});
		return result;
	}


	@Action({
		params: IPlugin.DeleteMstPluginInputSchema,
		rest: 'DELETE deleteMasterPlugin/:id'
	}
	)
	public async deleteMasterPlugin(ctx: Context<IPlugin.IDeletePluginInput>): Promise<IPlugin.IDeletePluginOutput> {
		let model = new ModelMstPlugin(ctx, null, true);
		let result: any = null;
		await model.openTransaction(async (trx: Knex.Transaction) => {
			result = await model.deleteByPrimaryKey(ctx.params.id, ['id']);
		});
		return result;
	}
}

module.exports = new PluginService();
