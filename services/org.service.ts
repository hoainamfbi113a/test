//#region Global Imports
import { Context, ServiceSchema, Errors } from "moleculer";
import { Action } from "moleculer-decorators";
import { IOrg, IUser } from 'Interfaces';
import { ModelOrganization, ModelUser } from "../src/models";
import uuid = require("uuid");
import { Model } from "BaseService/db/Model";
import Knex = require("knex");

class OrgService implements ServiceSchema {
	public name: string = 'org';

	@Action()
	public async activate(ctx: Context<IOrg.IActivateOrgInput>): Promise<any> {
		const { email, orgId, verifyCode, transaction } = ctx.params;
		const baseModel = new Model(ctx);
		let activatedUserResponse = null;
		await baseModel.openTransaction(async (trx: Knex.Transaction) => {
			if (transaction) {
				trx = transaction;
			}
			const organizationModel = new ModelOrganization(ctx, trx);
			let currentOrg = (await organizationModel.find(orgId, ['id', 'is_active']));
			if (!currentOrg) {
				throw new Errors.MoleculerClientError('This organization was not existed');
			} else if (currentOrg.is_active) {
				throw new Errors.MoleculerClientError('This organization was activated');
			}
			currentOrg.is_active = true;
			let data = await organizationModel.findAndUpdate(currentOrg.id, currentOrg).catch((error) => {
				throw error;
			});
			let activatedUserInput: IUser.IActivateUserInput = {
				email: email,
				orgId: orgId,
				transaction: trx,
				verifyCode: verifyCode
			}
			activatedUserResponse = await ctx.call('user.activate', activatedUserInput);
			if (activatedUserResponse instanceof Error) {
				throw activatedUserResponse;
			}

		}).catch((error) => {
			throw error;
		})
		return {
			data: activatedUserResponse
		}
	}

	@Action()
	public async create(ctx: Context<IOrg.ICreateOrg>): Promise<any> {
		const { first_name, last_name, company_name, phone_number, email, password, redirectUrl, transaction } = ctx.params
		let org_password = uuid.v4();
		let data = new IOrg.Organization(uuid.v4(), org_password, company_name);
		const baseModel = new Model(ctx);
		let orgId = null;
		let createdUser: IUser.CreateUserOutput
		await baseModel.openTransaction(async (trx: Knex.Transaction) => {
			if (transaction) {
				trx = transaction;
			}
			const orgModel = new ModelOrganization(ctx, trx);
			let orgIds = await orgModel.insertReturnId(data);
			orgId = orgIds[0];
			let userInput: IUser.ICreateUserInput = {
				email: email,
				first_name: first_name,
				last_name: last_name,
				org_id: orgId,
				password: password,
				phone_number: phone_number,
				redirectUrl: redirectUrl,
				transaction: trx
			}
			let userServiceResponse: any = await ctx.call('user.create', userInput);

			if (userServiceResponse instanceof Error) {
				throw userServiceResponse;
			} else {
				createdUser = userServiceResponse;
			}
		}).then((value) => { }).catch((error) => {
			throw error;
		});
		return {
			isError: false,
			email: createdUser.email
		};
	}
}

module.exports = new OrgService();
