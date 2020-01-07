//#region Global Imports
import { Context, ServiceSchema, Errors } from "moleculer";
import { Action, Method } from "moleculer-decorators";
import { IUser } from 'Interfaces';
import { ModelUser, User } from "../src/models";
import uuid = require('uuid');
import { Model } from "BaseService/db/Model";
import { QueryCondition } from "BaseService/interfaces/iModel";
import jwtService from "BaseService/services/jwt.service";
import { pluck } from "BaseService/lib/utils";
import { GetAllSchema, IGetAllInput } from "BaseService/services/base.validator";
import Knex = require("knex");

class UserService implements ServiceSchema {
	public name: string = 'user';
	@Action({
		params: GetAllSchema,
		rest: "POST /list"
	})
	public async getAllUsers(ctx: Context<IGetAllInput>) {
		let model: ModelUser = new ModelUser(ctx);
		let params = ctx.params;
		let additionalCondition = {
			"is_deleted": {
				"$eq": false
			}
		}
		params.where = params.where ? params.where : [];
		params.where.push(additionalCondition);
		return await model.getAllByConditions(params.where, params.order, params.pageSize, params.pageIndex);
	}

	@Action({
		body: {
			email: { type: "string" }
		},
	})
	public async checkEmailExist(ctx: any): Promise<any> {
		const { email } = ctx.params
		const userModel = new ModelUser(ctx);
		let currentUser = await userModel.findByQuery([new QueryCondition('email', '=', email)], ['id']);
		let response = {
			exist: false,
			message: 'Email not exist'
		}
		if (currentUser) {
			response = {
				exist: true,
				message: 'Email exist'
			}
		}
		return response;
	}

	@Action()
	public async create(ctx: Context<IUser.ICreateUserInput>): Promise<IUser.CreateUserOutput> {
		const { email, first_name, last_name, org_id, password, phone_number, redirectUrl, transaction } = ctx.params
		const baseModel = new Model(ctx);
		let verification_code = uuid.v4();
		let user = new User();
		let hashedPassword = await jwtService.hash(password);
		user.initOrg(uuid.v4(), org_id, email, first_name, last_name, hashedPassword, phone_number, verification_code);

		await baseModel.openTransaction(async (trx: Knex.Transaction) => {
			if (transaction) {
				trx = transaction;
			}
			const userModel = new ModelUser(ctx, trx);
			let currentUser = await userModel.findByQuery([new QueryCondition('email', '=', email)], ['id']);
			if (currentUser) {
				return new Errors.ValidationError(`User ${email} was existed`);
			}
			await userModel.insert(user);

		}).catch((error) => {
			throw new Errors.MoleculerError(error);
		});
		let response: IUser.CreateUserOutput = pluck<IUser.CreateUserOutput>(user, new IUser.CreateUserOutput());
		await ctx.call('mail-notification.sendMailActiveOrg', { user: user, redirectUrl: redirectUrl })
		return response;
	}

	@Action()
	public async activate(ctx: Context<IUser.IActivateUserInput>): Promise<any> {
		const { email, orgId, verifyCode, transaction } = ctx.params;
		const baseModel = new Model(ctx);
		let user: User;
		await baseModel.openTransaction(async (trx: Knex.Transaction) => {
			if (transaction) {
				trx = transaction;
			}
			let conditions: Array<QueryCondition> = new Array<QueryCondition>();
			conditions.push(new QueryCondition('email', '=', email));
			conditions.push(new QueryCondition('org_id', '=', orgId));
			let userModel = new ModelUser(ctx, trx);
			user = await userModel.findByQuery(conditions);
			if (!user) {
				throw `User ${email} is not existed`;
			}
			delete user.password;
			let activatedUser = this.activateUser(user, verifyCode);
			await userModel.findAndUpdate(activatedUser.id, activatedUser);
		})
		return {
			...user
		}
	}

	@Action({
		params: IUser.ForgotPasswordInputSchema
	})
	public async forgotPassword(ctx: Context<IUser.IForgotPasswordInput>): Promise<any> {
		const { email, redirectUrl } = ctx.params;
		const baseModel = new Model(ctx);
		let user: User;
		let isSuccess = true;
		await baseModel.openTransaction(async (trx: Knex.Transaction) => {
			let userModel = new ModelUser(ctx, trx);
			let conditions: Array<QueryCondition> = new Array<QueryCondition>();
			conditions.push(new QueryCondition('email', '=', email));
			let user = await userModel.findByQuery(conditions, ['id']);
			if (!user || (user && !user.id)) {
				throw new Errors.MoleculerClientError('This user was not existed');
			}
			user.verify_code = uuid.v4();
			await userModel.update(user, conditions);
			let response = await ctx.call('mail-notification.sendForgotPasswordEmail', { email: email, verifyCode: user.verify_code, redirectUrl: redirectUrl });
			if (response instanceof Error) {
				throw response;
			}
		}).catch((error) => {
			console.log(error);
			isSuccess = false;
		})
		return isSuccess;
	}

	@Action({
		params: IUser.CheckUserVerifyCodeSchema
	})
	public async checkUserVerifyCode(ctx: Context<IUser.ICheckUserVerifyCodeInput>): Promise<any> {
		const { email, verifyCode } = ctx.params;
		let userModel = new ModelUser(ctx);
		let user = await userModel.isActiveVerifyCode(email, verifyCode);
		if (!user) {
			return false;
		}
		return true;
	}

	@Action({
		params: IUser.ResetPasswordSchema
	})
	public async resetPassword(ctx: Context<IUser.IResetPasswordInput>): Promise<any> {
		const { email, verifyCode, password } = ctx.params;
		let userModel = new ModelUser(ctx);
		let user = await userModel.isActiveVerifyCode(email, verifyCode);
		if (!user) {
			return false;
		}
		let hashedPassword = await jwtService.hash(password);
		let newPasswordUser = new User();
		newPasswordUser.password = hashedPassword;
		return await userModel.updateUserPassword(email, verifyCode, hashedPassword);
	}

	@Method
	private activateUser(user: User, verifyCode: string): User {
		if (!user) {
			throw new Errors.MoleculerClientError('This user was not existed');
		} else if (user.verify_code != verifyCode) {
			throw new Errors.MoleculerClientError('Verification code is invalid');
		} else if (user.activated) {
			throw new Errors.MoleculerClientError('This user was activated');
		} else if (user.is_deleted) {
			throw new Errors.MoleculerClientError('This user was deleted');
		}
		let activatedUser = new User();
		activatedUser.id = user.id;
		activatedUser.activated = true;
		activatedUser.verify_code = null;
		return activatedUser;
	}
}

module.exports = new UserService();
