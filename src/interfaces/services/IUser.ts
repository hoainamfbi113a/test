import { IBaseServiceQuery } from "BaseService/interfaces/common";

export namespace IUser {
	export interface ICreateUserInput extends IBaseServiceQuery {
		org_id: string;
		email: string;
		first_name: string;
		last_name: string;
		password: string;
		phone_number: string;
		redirectUrl: string;
	}
	export interface IActivateUserInput extends IBaseServiceQuery {
		email: string;
		verifyCode: string;
		orgId: string;
	}

	export const ForgotPasswordInputSchema = {
		email: { type: "email" },
		redirectUrl: { type: "string" },
		$$strict: true
	}
	export interface IForgotPasswordInput {
		email: string;
		redirectUrl: string;
	}

	export const CheckUserVerifyCodeSchema = {
		email: { type: "email" },
		verifyCode: { type: "uuid" },
		$$strict: true
	}
	export interface ICheckUserVerifyCodeInput {
		email: string;
		verifyCode: string;
	}

	export const ResetPasswordSchema = {
		...CheckUserVerifyCodeSchema,
		password: { type: "string", min: 1 }
	}
	export interface IResetPasswordInput {
		email: string;
		verifyCode: string;
		password: string;
	}

	export class CreateUserOutput {
		org_id: string = null;
		email: string = null;
		first_name: string = null;
		last_name: string = null;
		phone_number: string = null;
		redirectUrl: string = null;
	}
}
