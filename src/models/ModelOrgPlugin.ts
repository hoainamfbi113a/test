
import { Model } from 'BaseService/db/Model';
import { IPlugin } from 'Interfaces'
import Knex = require('knex');
export class ModelOrgPlugin extends Model<IPlugin.OrgPlugin> {
    public tableName: string = "org_plugins";
    public async getAllActivePlugins(limit: number = 20, offset: number = 0, columnName: string[] = ['*']) {
        return this.getAll(limit, offset, columnName).from(this.tableName)
            .join('mst_plugins', { 'mst_plugins.id': 'org_plugins.plugin_id' })
            .where({ 'mst_plugins.is_deleted': false, 'org_plugins.is_active': true });
    }
}
