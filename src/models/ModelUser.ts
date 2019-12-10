import { Model } from 'BaseService/db/Model';

export class User {
    public initOrg($id: string, $org_id: string, $email: string, $first_name: string, $last_name: string, $password: string, $phone_number: string, $verify_code: string) {
        this.init($id, $org_id, $email, $first_name, $last_name, $password, $phone_number, $verify_code);
    }

    public init($id: string, $org_id: string, $email: string, $first_name: string, $last_name: string, $password: string, $phone_number: string, $verify_code: string) {
        this.id = $id;
        this.org_id = $org_id;
        this.email = $email;
        this.first_name = $first_name;
        this.last_name = $last_name;
        this.password = $password;
        this.phone_number = $phone_number;
        this.verify_code = $verify_code;
        this.activated = this.is_super = this.is_deleted = false;
    }

    public id: string;
    public org_id: string;
    public email: string;
    public first_name: string;
    public last_name: string;
    public password: string;
    public phone_number: string;
    public verify_code: string;
    public team_id: string;
    public permission: string;
    public activated: boolean;
    public is_super: boolean;
    public is_deleted: boolean;
    public created_at: Date;
    public updated_at: Date;
}

export class ModelUser extends Model<User> {
    public tableName: string = "user";

    public async getUserByEmail(email: string): Promise<any> {
        return await this.select('*').where({
            email
        }).first();
    }
}
