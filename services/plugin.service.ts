
import Knex = require("knex");
import { Context, ServiceSchema, Errors } from "moleculer";
import { Action } from "moleculer-decorators";
import { IPlugin } from 'Interfaces';
import { ModelMstPlugin, ModelOrgPlugin } from "../src/models";
import { Model } from "BaseService/db/Model";

class PluginService implements ServiceSchema {
	public name: string = 'plugin';


	@Action()
	public async getAllMaster(ctx: Context<IPlugin.IGetPluginInput>): Promise<IPlugin.GetPluginOutput> {

		let model = new ModelMstPlugin(ctx);
		let params: IPlugin.IGetPluginInput = ctx.params || {
			page: 1,
			pageSize: 20,
			transaction: null
		};
		let offset = (params.page - 1) * params.pageSize;
		return await model.getAll(params.pageSize, offset, ['name', 'key']);
	}

	@Action()
	public async getOrgPlugins(ctx: Context<IPlugin.IGetPluginInput>): Promise<IPlugin.GetPluginOutput> {

		let model = new ModelOrgPlugin(ctx);
		let params: IPlugin.IGetPluginInput = ctx.params || {
			page: 1,
			pageSize: 20,
			transaction: null
		};
		let offset = (params.page - 1) * params.pageSize;
		return await model.getAllActivePlugins(params.pageSize, offset, ['name', 'key']);
	}

	@Action()
	public async addOrgPlugin(ctx: Context<IPlugin.IGetPluginInput>): Promise<IPlugin.GetPluginOutput> {

		let model = new ModelOrgPlugin(ctx);
		let params: IPlugin.IGetPluginInput = ctx.params || {
			page: 1,
			pageSize: 20,
			transaction: null
		};
		let offset = (params.page - 1) * params.pageSize;
		let results = await model.getAll(params.pageSize, offset);
		return { results: results };
	}

	@Action()
	public async removeOrgPlugin(ctx: Context<IPlugin.IGetPluginInput>): Promise<IPlugin.GetPluginOutput> {

		let model = new ModelOrgPlugin(ctx);
		let params: IPlugin.IGetPluginInput = ctx.params || {
			page: 1,
			pageSize: 20,
			transaction: null
		};
		let offset = (params.page - 1) * params.pageSize;
		let results = await model.getAll(params.pageSize, offset);
		return { results: results };
	}


	@Action()
	public async create(ctx: Context<IPlugin.ICreatePluginInput>): Promise<IPlugin.CreatePluginOutput> {
		const baseModel = new Model(ctx);
		let item = null;
		await baseModel.openTransaction(async (trx: Knex.Transaction) => {
			const pluginsModel = new ModelMstPlugin(ctx, trx);
			let data = new IPlugin.MstPlugin();
			data.name = ctx.params.name;
			item = await pluginsModel.insert(data);
		}).catch((error) => {
			throw new Errors.MoleculerError(error);
		});
		return item;
	}

	@Action()
	public async update(ctx: Context<IPlugin.IUpdatePluginInput>): Promise<IPlugin.UpdatePluginOutput> {
		const baseModel = new Model(ctx);
		let item = null;
		await baseModel.openTransaction(async (trx: Knex.Transaction) => {
			const pluginsModel = new ModelMstPlugin(ctx, trx);
			let data = new IPlugin.MstPlugin();
			data.name = ctx.params.name;
			data.is_deleted = ctx.params.is_deleted;
			data.id = ctx.params.id;
			item = await pluginsModel.update(data);
		}).catch((error) => {
			throw new Errors.MoleculerError(error);
		});
		return item;
	}

	@Action()
	public async delete(ctx: Context<IPlugin.IDeletePluginInput>): Promise<IPlugin.DeletePluginOutput> {
		throw "Not yet implement";
	}
}

module.exports = new PluginService();
