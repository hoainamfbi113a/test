
import { Model } from 'BaseService/db/Model';
import { IPlugin } from 'Interfaces'

export class OrgPlugin {
    public id: string;
    public org_id: string;
    public plugin_id: string;
    public is_active: boolean;
    public is_deleted: boolean;
    public created_at: Date;
    public updated_at: Date;
}

export class ModelOrgPlugin extends Model<OrgPlugin> {
    public tableName: string = "org_plugins";
    public async getAllActiveOrgPlugins(limit: number = 20, offset: number = 0, columnName: string[] = ['*']) {
        return this.getAll(limit, offset, columnName).from(this.tableName)
            .join('mst_plugins', { 'mst_plugins.id': 'org_plugins.plugin_id' })
            .where({ 'mst_plugins.is_deleted': false, 'org_plugins.is_active': true });
    }

    public async removeOrgPlugins(pluginId: string) {
        return this.DB.from(this.tableName)
            .where({ 'plugin_id': pluginId })
            .update({ is_active: false, is_deleted: true });
    }
}
