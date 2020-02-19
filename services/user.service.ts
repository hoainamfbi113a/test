//#region Global Imports
import { Model } from "BaseService/db/Model";
import { QueryCondition } from "BaseService/interfaces/iModel";
import { pluck } from "BaseService/lib/utils";
import {
  GetAllSchema,
  IGetAllInput,
} from "BaseService/services/base.validator";
import jwtService from "BaseService/services/jwt.service";
import { IUser } from "Interfaces";
import Knex = require("knex");
import { Context, Errors, ServiceSchema } from "moleculer";
import { Action, Method } from "moleculer-decorators";
import uuid = require("uuid");
import { ModelUser, User } from "../src/models";

class UserService implements ServiceSchema {
  public name: string = "user";
  @Action({
    params: GetAllSchema,
    rest: "POST /list",
  })
  public async getAllUsers(ctx: Context<IGetAllInput>) {
    const model: ModelUser = new ModelUser(ctx);
    const params = ctx.params;
    const additionalCondition = {
      is_deleted: {
        $eq: false,
      },
    };
    params.where = params.where ? params.where : [];
    params.where.push(additionalCondition);
    return await model.getAllByConditions(
      params.where,
      params.order,
      params.pageSize,
      params.pageIndex,
      [
        "is_deleted",
        "id",
        "created_at",
        "updated_at",
        "org_id",
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "activated",
        "is_super",
        "verify_code",
        "team_id",
        "permission",
      ],
    );
  }

  @Action({
    body: {
      email: { type: "string" },
    },
  })
  public async checkEmailExist(ctx: any): Promise<any> {
    const { email } = ctx.params;
    const userModel = new ModelUser(ctx);
    const currentUser = await userModel.findByQuery(
      [new QueryCondition("email", "=", email)],
      ["id"],
    );
    let response = {
      exist: false,
      message: "Email not exist",
    };
    if (currentUser) {
      response = {
        exist: true,
        message: "Email exist",
      };
    }
    return response;
  }
  @Action({
    params: {
      $$strict: true,
      data: {
        props: {
          email: { type: "email" },
          first_name: { type: "string", optional: true },
          id: { type: "uuid", optional: true },
          last_name: { type: "string", optional: true },
          permissions: { type: "object", optional: true },
          phone_number: { type: "string", optional: true },
          team: { type: "object", optional: true },
        },
        strict: false,
        type: "object",
      },
    },
    rest: "POST /add",
  })
  public async add(ctx: Context<any, any>): Promise<any> {
    const data = ctx.params.data;
    const {
      email,
      first_name,
      last_name,
      org_id,
      phone_number,
      permissions,
      team,
    } = ctx.params.data;

    const baseModel = new Model(ctx);
    const verificationCode = uuid.v4();
    const user = new User();
    user.initOrg(
      uuid.v4(),
      org_id,
      email,
      first_name,
      last_name,
      null,
      phone_number,
      verificationCode,
    );
    user.permission = permissions;
    user.team_id = team?.id;
    await baseModel
      .openTransaction(async (trx: Knex.Transaction) => {
        const userModel = new ModelUser(ctx, trx);
        const currentUser = await userModel.findByQuery(
          [new QueryCondition("email", "=", email)],
          ["id"],
        );
        if (currentUser) {
          return new Errors.ValidationError(`User ${email} was existed`);
        }
        await userModel.insert(user);
        await ctx.call("mail-notification.sendMailActiveUser", {
          redirectUrl: "active-account",
          user,
        });
      })
      .catch((error) => {
        throw new Errors.MoleculerError(error);
      });

    return {
      email: data.email,
      isError: false,
    };
  }
  @Action()
  public async create(
    ctx: Context<IUser.ICreateUserInput>,
  ): Promise<IUser.CreateUserOutput> {
    const {
      email,
      first_name,
      last_name,
      org_id,
      password,
      phone_number,
      redirectUrl,
      transaction,
    } = ctx.params;
    const baseModel = new Model(ctx);
    const verificationCode = uuid.v4();
    const user = new User();
    const hashedPassword = await jwtService.hash(password);
    user.initOrg(
      uuid.v4(),
      org_id,
      email,
      first_name,
      last_name,
      hashedPassword,
      phone_number,
      verificationCode,
    );

    await baseModel
      .openTransaction(async (trx: Knex.Transaction) => {
        if (transaction) {
          trx = transaction;
        }
        const userModel = new ModelUser(ctx, trx);
        const currentUser = await userModel.findByQuery(
          [new QueryCondition("email", "=", email)],
          ["id"],
        );
        if (currentUser) {
          return new Errors.ValidationError(`User ${email} was existed`);
        }
        await userModel.insert(user);
      })
      .catch((error) => {
        throw new Errors.MoleculerError(error);
      });
    const response: IUser.CreateUserOutput = pluck<IUser.CreateUserOutput>(
      user,
      new IUser.CreateUserOutput(),
    );
    await ctx.call("mail-notification.sendMailActiveOrg", {
      user,
      redirectUrl,
    });
    return response;
  }

  @Action()
  public async activate(ctx: Context<IUser.IActivateUserInput>): Promise<any> {
    const { email, orgId, verifyCode, transaction } = ctx.params;
    const baseModel = new Model(ctx);
    let user: User;
    await baseModel.openTransaction(async (trx: Knex.Transaction) => {
      if (transaction) {
        trx = transaction;
      }
      const conditions: QueryCondition[] = new Array<QueryCondition>();
      conditions.push(new QueryCondition("email", "=", email));
      conditions.push(new QueryCondition("org_id", "=", orgId));
      const userModel = new ModelUser(ctx, trx);
      user = await userModel.findByQuery(conditions);
      if (!user) {
        throw new Error(`User ${email} is not existed`);
      }
      delete user.password;
      const activatedUser = this.activateUser(user, verifyCode);
      await userModel.findAndUpdate(activatedUser.id, activatedUser);
    });
    return {
      ...user,
    };
  }
  @Action({
    params: {
      $$strict: true,
      email: { type: "email" },
      firstName: { type: "string", optional: true },
      lastName: { type: "string", optional: true },
      password: { type: "string", empty: false },
      verifyCode: { type: "uuid", empty: false },
    },
  })
  public async activateWithoutOrg(ctx: Context<any>) {
    const { email, firstName, lastName, password, verifyCode } = ctx.params;
    const baseModel = new Model(ctx);
    let user: User;
    await baseModel.openTransaction(async (trx: Knex.Transaction) => {
      const conditions: QueryCondition[] = new Array<QueryCondition>();
      conditions.push(new QueryCondition("email", "=", email));
      conditions.push(new QueryCondition("verify_code", "=", verifyCode));
      const userModel = new ModelUser(ctx, trx);
      user = await userModel.findByQuery(conditions);
      if (!user) {
        throw new Error(`User ${email} is not existed`);
      }
      delete user.password;
      const activatedUser = this.activateUser(user, verifyCode);
      activatedUser.first_name = firstName;
      activatedUser.last_name = lastName;
      activatedUser.password = await jwtService.hash(password);
      await userModel.findAndUpdate(activatedUser.id, activatedUser);
    });
    return {
      isError: false,
    };
  }
  @Action({
    params: IUser.ForgotPasswordInputSchema,
  })
  public async forgotPassword(
    ctx: Context<IUser.IForgotPasswordInput>,
  ): Promise<any> {
    const { email, redirectUrl } = ctx.params;
    const baseModel = new Model(ctx);
    let isSuccess = true;
    await baseModel
      .openTransaction(async (trx: Knex.Transaction) => {
        const userModel = new ModelUser(ctx, trx);
        const conditions: QueryCondition[] = new Array<QueryCondition>();
        conditions.push(new QueryCondition("email", "=", email));
        const user = await userModel.findByQuery(conditions, ["id"]);
        if (!user || (user && !user.id)) {
          throw new Errors.MoleculerClientError("This user was not existed");
        }
        user.verify_code = uuid.v4();
        await userModel.update(user, conditions);
        const response = await ctx.call(
          "mail-notification.sendForgotPasswordEmail",
          {
            email,
            redirectUrl,
            verifyCode: user.verify_code,
          },
        );
        if (response instanceof Error) {
          throw response;
        }
      })
      .catch((error) => {
        console.log(error);
        isSuccess = false;
      });
    return isSuccess;
  }

  @Action({
    params: IUser.CheckUserVerifyCodeSchema,
  })
  public async checkUserVerifyCode(
    ctx: Context<IUser.ICheckUserVerifyCodeInput>,
  ): Promise<any> {
    const { email, verifyCode } = ctx.params;
    const userModel = new ModelUser(ctx);
    const user = await userModel.isActiveVerifyCode(email, verifyCode);
    if (!user) {
      return false;
    }
    return true;
  }

  @Action({
    params: IUser.ResetPasswordSchema,
  })
  public async resetPassword(
    ctx: Context<IUser.IResetPasswordInput>,
  ): Promise<any> {
    const { email, verifyCode, password } = ctx.params;
    const userModel = new ModelUser(ctx);
    const user = await userModel.isActiveVerifyCode(email, verifyCode);
    if (!user) {
      return false;
    }
    const hashedPassword = await jwtService.hash(password);
    const newPasswordUser = new User();
    newPasswordUser.password = hashedPassword;
    return await userModel.updateUserPassword(
      email,
      verifyCode,
      hashedPassword,
    );
  }

  @Method
  private activateUser(user: User, verifyCode: string): User {
    if (!user) {
      throw new Errors.MoleculerClientError("This user was not existed");
    } else if (user.verify_code != verifyCode) {
      throw new Errors.MoleculerClientError("Verification code is invalid");
    } else if (user.activated) {
      throw new Errors.MoleculerClientError("This user was activated");
    } else if (user.is_deleted) {
      throw new Errors.MoleculerClientError("This user was deleted");
    }
    const activatedUser = new User();
    activatedUser.id = user.id;
    activatedUser.activated = true;
    activatedUser.verify_code = null;
    return activatedUser;
  }
}

module.exports = new UserService();
