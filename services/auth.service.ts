//#region Global Imports
import jwtService from "BaseService/services/jwt.service";
import { IAuth } from "Interfaces";
import { Context, Errors, ServiceSchema } from "moleculer";
import { Action } from "moleculer-decorators";
import { ModelOrganization, ModelUser } from "../src/models";

class AuthService implements ServiceSchema {
  public name: string = "auth";

  @Action({
    params: {
      email: { type: "email" },
      password: { type: "string", min: 6 },
    },
  })
  public async login(ctx: Context<IAuth.Login>): Promise<any> {
    const { email, password } = ctx.params;
    const modelUser = new ModelUser(ctx);
    const user = await modelUser.getUserByEmail(email);
    if (!user) {
      return {
        code: "email_not_register",
        isError: true,
        message: "Email not register",
      };
    }
    if (!user.activated) {
      return {
        code: "user_not_active",
        isError: true,
        message: "user not active",
      };
    }

    const check = await jwtService.compare(password, user.password);
    if (!check) {
      return {
        code: "wrong_password",
        isError: true,
        message: "Wrong password",
      };
    }

    const orgModel = new ModelOrganization(ctx);
    const org = await orgModel.getOrgByID(user.org_id);

    const token = await jwtService.sign({
      email: user.email,
      id: user.id,
      org_id: user.org_id,
    });
    const appToken = await jwtService.sign({
      app_id: "98eba6cd-4e2e-4988-a7cb-8321e49b73d3",
      org_id: "0314b535-b76d-4a79-af28-4deb8ea9b99f",
    });
    delete user.password;
    return {
      appToken,
      companyName: org.company_name,
      isError: false,
      token,
      userInfo: { ...user, companyName: user.company_name },
    };
  }

  @Action({
    params: {
      email: { type: "email" },
      password: { type: "string", min: 6 },
    },
  })
  public async loginContact(ctx: Context<IAuth.Login>): Promise<any> {
    const { email, password } = ctx.params;
    const modelUser = new ModelUser(ctx);
    const user = await modelUser.getUserByEmail(email);
    if (!user) {
      return {
        code: "email_not_register",
        isError: true,
        message: "Email not register",
      };
    }
    if (!user.activated) {
      return {
        code: "user_not_active",
        isError: true,
        message: "user not active",
      };
    }

    const check = await jwtService.compare(password, user.password);
    if (!check) {
      return {
        code: "wrong_password",
        isError: true,
        message: "Wrong password",
      };
    }

    const orgModel = new ModelOrganization(ctx);
    const org = await orgModel.getOrgByID(user.org_id);

    const token = await jwtService.sign({
      email: user.email,
      id: user.id,
      org_id: user.org_id,
    });
    delete user.password;
    return {
      companyName: org.company_name,
      isError: false,
      token,
      userInfo: { ...user, companyName: user.company_name },
    };
  }
}

module.exports = new AuthService();
