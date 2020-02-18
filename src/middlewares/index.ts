// @ts-ignore
import jwtService from "BaseService/services/jwt.service";
import { Errors } from "moleculer";
import { ModelOrganization, ModelUser } from "../models";
const {
  UnAuthorizedError,
  ERR_NO_TOKEN,
} = require("BaseService/services/errors");

class Middleware {
  public authentication = async (ctx: any, route: any, req: any, res: any) => {
    try {
      // check app token
      const appToken = req.headers["app-token"];
      if (appToken) {
        const data = await jwtService.verify(appToken);
        const { payload } = data;
        const orgID = payload.org_id;
        const modelOrg = new ModelOrganization(ctx);
        const org = await modelOrg.getOrgByID(orgID);
        ctx.meta.isAuthencated = true;
        ctx.meta.userInfo = null;
        ctx.meta.orgInfo = org;
        ctx.meta.method = req.method;
        ctx.meta.clientIp =
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress;
        // Verify JWT token Contact
        const token = req.headers.token;
        if (token) {
          const dataContact = await jwtService.verify(token);
          ctx.meta.contact = dataContact.payload;
        }
        modelOrg.DB.destroy();
      } else {
        // Verify JWT token
        const token = req.headers.token;
        if (!token) {
          return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
        }
        const data = await jwtService.verify(token);
        const { payload } = data;
        const modelUser = new ModelUser(ctx);
        const modelOrg = new ModelOrganization(ctx);
        const id = payload.id;
        const orgID = payload.org_id;
        const test = await modelUser.query().first();
        const user = await modelUser
          .select("*")
          .where({
            id,
            org_id: orgID,
          })
          .first();
        if (!user) {
          modelUser.DB.destroy();
          return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
        } else {
          const org = await modelOrg.getOrgByID(orgID);
          ctx.meta.isAuthencated = true;
          ctx.meta.userInfo = user;
          ctx.meta.orgInfo = org;
          ctx.meta.method = req.method;
          ctx.meta.clientIp =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        }
        modelUser.DB.destroy();
        modelOrg.DB.destroy();
      }
    } catch (error) {
      return Promise.reject(new Errors.MoleculerError(error.toString()));
    }
  };
  public authenticateSocket = async (token: any) => {
    try {
      const data = await jwtService.verify(token);
      return data;
    } catch (error) {
      return Promise.reject(new Errors.MoleculerError(error.toString()));
    }
  };
}
export default new Middleware();
