
import { Context, ServiceSchema } from "moleculer";
import { Action, Method } from "moleculer-decorators";
import { IMailNotification } from 'Interfaces';
import { ModelMailTemplate } from "../src/models";
import { MailService } from "BaseService/services/mail.service";
import BaseServiceConfig from "BaseService/config/envs/index";
import { QueryCondition } from "base-service/dist/interfaces/iModel";

class MailNotificationService implements ServiceSchema {
  public name: string = 'mail-notification';

  @Action({
    params: IMailNotification.SendMailActiveOrgSchema,
    visibility: "public"
  })

  public async sendMailActiveOrg(ctx: Context<IMailNotification.ISendMailActiveOrgInput>) {
    let mailTemplateModel = new ModelMailTemplate(ctx, null, true);
    let query = new QueryCondition('type', '=', 'signUp');
    let mailTemplate = await mailTemplateModel.findByQuery([query], ['*']);
    let message = this.attachTemplateValue(mailTemplate.body, [
      {
        key: 'email',
        value: ctx.params.user.email
      },
      {
        key: 'link',
        value: `${process.env.URL_CREATE_ORG}${ctx.params.redirectUrl}?verify_code=${ctx.params.user.verify_code}&email=${ctx.params.user.email}&orgId=${ctx.params.user.org_id}`
      }
    ]);
    let from = BaseServiceConfig.MailService.user;
    let to = ctx.params.user.email;
    this.sendMail(from, to, mailTemplate.subject, message);
  }

  @Method
  private attachTemplateValue(template: string, keyValuePairs: any[]) {
    for (const keyValue of keyValuePairs) {
      template = template.replace(new RegExp(`{{${keyValue.key}}}`, 'g'), keyValue.value);
    }
    return template;
  }

  @Method
  private sendMail(from: string, to: string, subject: string, message: string) {
    let mailService = new MailService(null);
    mailService.sendMail(
      {
        'from': from,
        'to': to,
        'subject': subject,
        'message': message
      });
  }
}

module.exports = new MailNotificationService();
