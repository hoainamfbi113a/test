import { IBaseServiceQuery } from "BaseService/interfaces/common";
import { User } from "../../models";
export namespace IMailNotification {
  export const SendMailActiveOrgSchema = {
    redirectUrl: { type: "string", min: 1 },
    user: { type: "object" },
    $$strict: true
  }
  export interface ISendMailActiveOrgInput extends IBaseServiceQuery {
    redirectUrl: string;
    user: User;
  }
  export const SendMailForgotPasswordSchema = {
    redirectUrl: { type: "string", min: 1 },
    email: { type: "email" },
    verifyCode: { type: "uuid" },
    $$strict: true
  }
  export interface ISendMailForgotPasswordInput {
    redirectUrl: string;
    email: string;
    verifyCode: string;
  }

}