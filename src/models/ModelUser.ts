import { Model } from 'BaseService/db/Model';
import { IUser } from 'Interfaces'
export class ModelUser extends Model<IUser.User> {
    public tableName: string = "user";

    public async getUserByEmail(email: string): Promise<any> {
        return await this.select('*').where({
            email
        }).first();
    }
}
