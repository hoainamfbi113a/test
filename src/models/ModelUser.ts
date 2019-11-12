import { Model } from 'BaseService/db/Model';
export class ModelUser extends Model {
    public tableName: string = "user";

    public async getUserByEmail( email: string ): Promise<any>{
        return await this.select('*').where({
            email
        }).first();
    }
}
