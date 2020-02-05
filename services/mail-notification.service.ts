import BaseServiceConfig from "BaseService/config/envs/index";
import { MailTemplateType } from "BaseService/constant/enum";
import { MailService } from "BaseService/services/mail.service";
import { IMailNotification } from "Interfaces";
import { Context, ServiceSchema } from "moleculer";
import { Action, Method } from "moleculer-decorators";
import { ModelMailTemplate } from "../src/models";

class MailNotificationService implements ServiceSchema {
  public name: string = "mail-notification";

  @Action({
    params: IMailNotification.SendMailActiveOrgSchema,
    visibility: "public",
  })
  public async sendMailActiveOrg(
    ctx: Context<IMailNotification.ISendMailActiveOrgInput>,
  ) {
    const mailTemplateModel = new ModelMailTemplate(ctx, null, true);
    const mailTemplate = await mailTemplateModel.getByType(
      MailTemplateType.SIGN_UP,
    );
    if (!mailTemplate) {
      throw new Error("Mail template is not existed");
    }
    const message = this.attachTemplateValue(mailTemplate.body, [
      {
        key: "email",
        value: ctx.params.user.email,
      },
      {
        key: "link",
        value: `${process.env.URL_CREATE_ORG}${ctx.params.redirectUrl}?verify_code=${ctx.params.user.verify_code}&email=${ctx.params.user.email}&orgId=${ctx.params.user.org_id}`,
      },
    ]);
    const from = BaseServiceConfig.MailService.user;
    const to = ctx.params.user.email;
    this.sendMail(from, to, mailTemplate.subject, message);
  }

  @Action({
    params: IMailNotification.SendMailForgotPasswordSchema,
    visibility: "public",
  })
  public async sendForgotPasswordEmail(
    ctx: Context<IMailNotification.ISendMailForgotPasswordInput>,
  ) {
    const { email, redirectUrl, verifyCode } = ctx.params;
    const mailTemplateModel = new ModelMailTemplate(ctx, null, true);
    const mailTemplate = await mailTemplateModel.getByType(
      MailTemplateType.FORGOT_PASSWORD,
    );
    if (!mailTemplate) {
      throw new Error("This mail template was not existed");
    }
    const message = this.attachTemplateValue(mailTemplate.body, [
      {
        key: "email",
        value: email,
      },
      {
        key: "link",
        value: `${process.env.URL_WEB_ADMIN}${redirectUrl}?verify_code=${verifyCode}&email=${email}`,
      },
    ]);
    const from = BaseServiceConfig.MailService.user;
    const to = email;
    this.sendMail(from, to, mailTemplate.subject, message);
  }

  @Method
  private attachTemplateValue(template: string, keyValuePairs: any[]) {
    for (const keyValue of keyValuePairs) {
      template = template.replace(
        new RegExp(`{{${keyValue.key}}}`, "g"),
        keyValue.value,
      );
    }
    return template;
  }

  @Method
  private sendMail(from: string, to: string, subject: string, message: string) {
    const mailService = new MailService(null);
    mailService.sendMail({
      from,
      message,
      subject,
      to,
    });
  }
}

module.exports = new MailNotificationService();
