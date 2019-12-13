import { IBaseServiceQuery } from "BaseService/interfaces/common";

export namespace IPlugin {
	export const GetPluginInputSchema = {
		page: { type: "number", min: 1, positive: true, integer: true, optional: true },
		pageSize: { type: "number", min: 1, positive: true, integer: true, optional: true },
		$$strict: true
	}

	export interface IGetMstPluginInput extends IBaseServiceQuery {
		page: number;
		pageSize: number;
	}

	export interface IGetMstPluginOutput {

	}

	export const CreateMstPluginInputSchema = {
		name: { type: "string", min: 1 },
		key: { type: "string", min: 1 },
		$$strict: true
	}

	export interface ICreateMstPluginInput extends IBaseServiceQuery {
		name: string;
		key: string;
	}

	export interface ICreateMstPluginOutput extends ICreateMstPluginInput {
		id: string;
	}

	export const UpdateMstPluginInputSchema = {
		id: { type: "uuid" },
		name: { type: "string", min: 1, optional: true },
		key: { type: "string", min: 1, optional: true },
		is_deleted: { type: "boolean", optional: true },
		$$strict: true
	}

	export interface IUpdateMstPluginInput extends IBaseServiceQuery {
		id: string;
		name: string;
		key: string;
		is_deleted: boolean;
	}

	export interface IUpdateMstPluginOutput extends IUpdateMstPluginInput {
	}

	export interface IUpdateOrgPluginInput extends IBaseServiceQuery {
		id: string;
		name: string;
		is_deleted: boolean;
		is_active: boolean
	}

	export interface IUpdatePluginOutput {

	}

	export const DeleteMstPluginInputSchema = {
		id: { type: "uuid" },
		$$strict: true
	}

	export interface IDeletePluginInput extends IBaseServiceQuery {
		id: string;
	}

	export interface IDeletePluginOutput {
		id: string;
	}

	export interface IGetOrgPluginInput extends IBaseServiceQuery {
		page: number;
		pageSize: number;
	}
	export interface IGetOrgPluginOutput {
		name: string;
		key: string;
	}
	export interface IAddOrgPluginInput {
		pluginId: string
	}

	export interface IAddOrgPluginOutput {
		pluginId: string
	}

	export interface IRemoveOrgPluginInput {
		pluginId: string
	}

	export interface IRemoveOrgPluginOutput {
		pluginId: string
	}

}
