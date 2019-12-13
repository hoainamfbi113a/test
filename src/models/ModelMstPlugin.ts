
import { Model } from 'BaseService/db/Model';

export class MstPlugin {
    public id: string;
    public name: string;
    public key: string;
    public is_deleted: boolean;
    public created_at: Date;
    public updated_at: Date;
}

export class ModelMstPlugin extends Model<MstPlugin> {
    public tableName: string = "mst_plugins";
    public isMaster: boolean = true;
    public async isValidPlugin(pluginId: string): Promise<boolean> {
        let result = await this.DB.from(this.tableName).where({ 'id': pluginId, 'is_deleted': false }).count();
        return result[0].count > 0;
    }
}
