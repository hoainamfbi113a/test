//#region Global Imports
import { Context, ServiceSchema, Errors } from "moleculer";
import { Action, Method } from "moleculer-decorators";
import { IUser } from 'Interfaces';
import { ModelUser } from "../src/models";
import uuid = require('uuid');
import { Model } from "BaseService/db/Model";
import { MailService } from "BaseService/services/mail.service";
import BaseServiceConfig from "BaseService/config/envs/index";
import { QueryCondition } from "BaseService/interfaces/iModel";
import jwtService from "BaseService/services/jwt.service";
import { pluck } from "BaseService/lib/utils";
import Knex = require("knex");

class UserService implements ServiceSchema {
	public name: string = 'user';


	@Action({
		body: {
			email: { type: "string" }
		},
	})
	public async checkEmailExist(ctx: any): Promise<any> {
		const { email } = ctx.params
		const userModel = new ModelUser(ctx);
		let currentUser = await userModel.findByQuery([new QueryCondition('email', '=', email)], 'id');
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
		let user = new IUser.User();
		let hashedPassword = await jwtService.hash(password);
		user.initOrg(uuid.v4(), org_id, email, first_name, last_name, hashedPassword, phone_number, verification_code);

		await baseModel.openTransaction(async (trx: Knex.Transaction) => {
			if (transaction) {
				trx = transaction;
			}
			const userModel = new ModelUser(ctx, trx);
			let currentUser = await userModel.findByQuery([new QueryCondition('email', '=', email)], 'id');
			if (currentUser) {
				return new Errors.ValidationError(`User ${email} was existed`);
			}
			await userModel.insert(user);

		}).catch((error) => {
			throw new Errors.MoleculerError(error);
		});
		let response: IUser.CreateUserOutput = pluck<IUser.CreateUserOutput>(user, new IUser.CreateUserOutput());
		this.sendVerificationMail(user, redirectUrl);
		return response;
	}

	@Action()
	public async activate(ctx: Context<IUser.IActivateUserInput>): Promise<any> {
		const { email, orgId, verifyCode, transaction } = ctx.params;
		const baseModel = new Model(ctx);
		let user: IUser.User;
		await baseModel.openTransaction(async (trx: Knex.Transaction) => {
			if (transaction) {
				trx = transaction;
			}
			let conditions: Array<QueryCondition> = new Array<QueryCondition>();
			conditions.push(new QueryCondition('email', '=', email));
			conditions.push(new QueryCondition('org_id', '=', orgId));
			let userModel = new ModelUser(ctx, trx);
			user = await userModel.findByQuery(conditions);
			delete user.password;
			let activatedUser = this.activateUser(user, verifyCode);
			await userModel.findAndUpdate(activatedUser.id, activatedUser);
		})
		return {
			...user
		}
	}

	@Method
	private sendVerificationMail(orgUser: IUser.User, redirectUrl: string = 'verify') {
		let mailService = new MailService(null);
		let verificationEmailSubject = 'Kích hoạt tài khoản';
		let message = mailService.template(
			{
				type: 'signUp',
				email: orgUser.email,
				link: `${process.env.URL_CREATE_ORG}${redirectUrl}?verify_code=${orgUser.verify_code}&email=${orgUser.email}&orgId=${orgUser.org_id}`
			});
		mailService.sendMail(
			{
				'from': BaseServiceConfig.MailService.user,
				'to': orgUser.email,
				'subject': verificationEmailSubject,
				'message': message
			});
	}

	@Method
	private activateUser(user: IUser.User, verifyCode: string): IUser.User {
		if (!user) {
			throw new Errors.MoleculerClientError('This user was not existed');
		} else if (user.verify_code != verifyCode) {
			throw new Errors.MoleculerClientError('Verification code is invalid');
		} else if (user.activated) {
			throw new Errors.MoleculerClientError('This user was activated');
		} else if (user.is_deleted) {
			throw new Errors.MoleculerClientError('This user was deleted');
		}
		let activatedUser = new IUser.User();
		activatedUser.id = user.id;
		activatedUser.activated = true;
		activatedUser.verify_code = null;
		return activatedUser;
	}
}

module.exports = new UserService();
