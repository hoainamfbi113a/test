import { IBaseServiceQuery } from "BaseService/interfaces/common";

export namespace IPlugin {
	export interface IGetPluginInput extends IBaseServiceQuery {
		page: number;
		pageSize: number;
	}

	export interface IInjectPluginInput extends IBaseServiceQuery {
		plugin_id: number
	}

	export class GetPluginOutput {

	}

	export interface ICreatePluginInput extends IBaseServiceQuery {
		name: string;
	}

	export class CreatePluginOutput {

	}

	export interface IUpdatePluginInput extends IBaseServiceQuery {
		id: string;
		name: string;
		is_deleted: boolean;
	}

	export class UpdatePluginOutput {

	}

	export interface IDeletePluginInput extends IBaseServiceQuery {

	}

	export class DeletePluginOutput {

	}

	export class MstPlugin {
		public id: string;
		public name: string;
		public is_deleted: boolean;
		public created_at: Date;
		public updated_at: Date;
	}

	export class OrgPlugin {
		public id: string;
		public org_id: string;
		public plugin_id: string;
		public is_active: boolean;
		public is_deleted: boolean;
		public created_at: Date;
		public updated_at: Date;
	}
}
