import { Model } from 'BaseService/db/Model';
export class Organization {

    constructor($id: string, $password?: string, $company_name?: string) {
        this.id = $id;
        this.password = $password;
        this.company_name = $company_name;
        this.is_active = false;
        this.is_deleted = false;
    }

    public id: string;
    public password: string;
    public company_name: string;
    public is_active: boolean;
    public is_deleted: boolean;
    public created_at: Date;
    public updated_at: Date;
}

export class ModelOrganization extends Model<Organization> {
    public tableName: string = "organization";

    public async getOrgByID(id: string): Promise<any> {
        // @ts-ignore
        return await this.find(id);
    }

    public async createOrg(data: Organization): Promise<any> {
        return await this.insert(data);
    }
}
