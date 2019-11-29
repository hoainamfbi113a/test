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

	export class Organization {

		constructor($id: string, $password?: string, $company_name?: string) {
			this.id = $id;
			this.password = $password;
			this.company_name = $company_name;
			this.is_active = false;
			this.is_deleted = false;
		}

		public id: string;
		public password: string;
		public company_name: string;
		public is_active: boolean;
		public is_deleted: boolean;
		public created_at: Date;
		public updated_at: Date;
	}
}
