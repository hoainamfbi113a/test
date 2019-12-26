
import { Model } from 'BaseService/db/Model';
import { QueryCondition } from 'base-service/dist/interfaces/iModel';

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

    public async getByType(type: string): Promise<MailTemplate> {

        let query = new QueryCondition('type', '=', type);
        let mailTemplate = await this.findByQuery([query], ['*']);
        if (!mailTemplate || (mailTemplate && !mailTemplate.type)) {
            return null;
        }
        return mailTemplate;
    }
}
