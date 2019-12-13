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

	export class CreateUserOutput {
		org_id: string = null;
		email: string = null;
		first_name: string = null;
		last_name: string = null;
		phone_number: string = null;
		redirectUrl: string = null;
	}
}
