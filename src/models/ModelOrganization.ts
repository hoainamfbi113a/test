import { Model } from 'BaseService/db/Model';
export class ModelOrganization extends Model {
    public tableName: string = "organization";

    public async getOrgByID(id: string): Promise<any>{
        // @ts-ignore
        return await this.find(id);
    }
}
