import { IBaseServiceQuery } from "base-service/dist/interfaces/common";

export namespace IOrg {
	export interface ICreateOrg extends IBaseServiceQuery {
		first_name: string;
		last_name: string;
		phone_number: string;
		company_name: string;
		email: string;
		password: string;
		redirectUrl: string;
	}

	export interface IActivateOrgInput extends IBaseServiceQuery {
		verifyCode: string;
		email: string;
		orgId: string;
	}
}
