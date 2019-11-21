import { Model } from 'BaseService/db/Model';
import { IOrg } from 'Interfaces';
export class ModelOrganization extends Model<IOrg.Organization> {
    public tableName: string = "organization";

    public async getOrgByID(id: string): Promise<any> {
        // @ts-ignore
        return await this.find(id);
    }

    public async createOrg(data: IOrg.Organization): Promise<any> {
        return await this.insert(data);
    }
}
