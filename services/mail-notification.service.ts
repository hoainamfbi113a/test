
import { Context, ServiceSchema } from "moleculer";
import { Action, Method } from "moleculer-decorators";
import { IMailNotification } from 'Interfaces';
import { User } from "../src/models";
import { MailService } from "BaseService/services/mail.service";
import BaseServiceConfig from "BaseService/config/envs/index";

class MailNotificationService implements ServiceSchema {
  public name: string = 'mail-notification';

  @Action({
    params: IMailNotification.SendMailActiveOrgSchema,
    visibility: "public"
  })

  public async sendMailActiveOrg(ctx: Context<IMailNotification.ISendMailActiveOrgInput>) {
    return this.sendVerificationMail(ctx.params.user, ctx.params.redirectUrl);
  }

  @Method
  private sendVerificationMail(orgUser: User, redirectUrl: string = 'verify') {
    let mailService = new MailService(null);
    let verificationEmailSubject = 'Kích hoạt tài khoản';
    let message = mailService.template(
      {
        type: 'signUp',
        email: orgUser.email,
        link: `${process.env.URL_CREATE_ORG}${redirectUrl}?verify_code=${orgUser.verify_code}&email=${orgUser.email}&orgId=${orgUser.org_id}`
      });
    mailService.sendMail(
      {
        'from': BaseServiceConfig.MailService.user,
        'to': orgUser.email,
        'subject': verificationEmailSubject,
        'message': message
      });
  }
}

module.exports = new MailNotificationService();
