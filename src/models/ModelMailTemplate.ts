
import { Model } from 'BaseService/db/Model';

export class MailTemplate {
    public type: string;
    public subject: string;
    public body: string;
    public is_deleted: boolean;
    public created_at: Date;
    public updated_at: Date;
}

export class ModelMailTemplate extends Model<MailTemplate> {
    public tableName: string = "mail_templates";
}
