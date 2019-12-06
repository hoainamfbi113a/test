
import { Model } from 'BaseService/db/Model';
import { IPlugin } from 'Interfaces'
export class ModelMstPlugin extends Model<IPlugin.MstPlugin> {
    public tableName: string = "mst_plugins";
}
