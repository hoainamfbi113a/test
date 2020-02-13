//#region Global Imports
import { Model } from "BaseService/db/Model";
import { IOrg, IUser } from "Interfaces";
import Knex = require("knex");
import { Context, Errors, ServiceSchema } from "moleculer";
import { Action } from "moleculer-decorators";
import uuid = require("uuid");
import { ModelOrganization, Organization } from "../src/models";

class OrgService implements ServiceSchema {
  public name: string = "org";

  @Action()
  public async activate(
    ctx: Context<IOrg.IActivateOrgInput, any>,
  ): Promise<any> {
    const { email, orgId, verifyCode, transaction } = ctx.params;
    const baseModel = new Model(ctx);
    let activatedUserResponse = null;
    await baseModel
      .openTransaction(async (trx: Knex.Transaction) => {
        if (transaction) {
          trx = transaction;
        }
        const organizationModel = new ModelOrganization(ctx, trx);
        const currentOrg = await organizationModel.find(orgId, [
          "id",
          "is_active",
        ]);
        if (!currentOrg) {
          throw new Errors.MoleculerClientError(
            "This organization was not existed",
          );
        } else if (currentOrg.is_active) {
          throw new Errors.MoleculerClientError(
            "This organization was activated",
          );
        }
        currentOrg.is_active = true;
        await organizationModel
          .findAndUpdate(currentOrg.id, currentOrg)
          .catch((error) => {
            throw error;
          });
        const activatedUserInput: IUser.IActivateUserInput = {
          email,
          orgId,
          transaction: trx,
          verifyCode,
        };
        activatedUserResponse = await ctx.call(
          "user.activate",
          activatedUserInput,
        );
        if (activatedUserResponse instanceof Error) {
          throw activatedUserResponse;
        }
      })
      .catch((error) => {
        throw error;
      });
    return {
      data: activatedUserResponse,
    };
  }

  @Action()
  public async create(ctx: Context<IOrg.ICreateOrg>): Promise<any> {
    const {
      first_name,
      last_name,
      company_name,
      phone_number,
      email,
      password,
      redirectUrl,
      transaction,
    } = ctx.params;
    const orgPassword = uuid.v4();
    const data = new Organization(uuid.v4(), orgPassword, company_name);
    const baseModel = new Model(ctx);
    let orgId = null;
    let createdUser: IUser.CreateUserOutput;
    await baseModel
      .openTransaction(async (trx: Knex.Transaction) => {
        if (transaction) {
          trx = transaction;
        }
        const orgModel = new ModelOrganization(ctx, trx);
        const orgIds = await orgModel.insertReturnId(data);
        orgId = orgIds[0];
        const userInput: IUser.ICreateUserInput = {
          email,
          first_name,
          last_name,
          org_id: orgId,
          password,
          phone_number,
          redirectUrl,
          transaction: trx,
        };
        const userServiceResponse: any = await ctx.call(
          "user.create",
          userInput,
        );

        if (userServiceResponse instanceof Error) {
          throw userServiceResponse;
        } else {
          createdUser = userServiceResponse;
        }
      })
      .then((value) => {})
      .catch((error) => {
        throw error;
      });
    return {
      email: createdUser.email,
      isError: false,
    };
  }
}

module.exports = new OrgService();
