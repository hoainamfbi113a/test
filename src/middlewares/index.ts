import { Errors } from "moleculer";
// @ts-ignore
import jwtService from "BaseService/services/jwt.service";
import { ModelUser,ModelOrganization } from "../models";

const { UnAuthorizedError, ERR_NO_TOKEN } = require("BaseService/services/errors");

class Middleware {
    authentication = async (ctx: any, route: any, req: any, res: any) => {
        try {
            console.log(req.query["test"]);
            // Verify JWT token
            const token = req.headers.token;
            if (!token) {
                return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
            }
            const data = await jwtService.verify(token);
            const { payload } = data;
            const modelUser = new ModelUser(ctx);
            const modelOrg = new ModelOrganization(ctx);
            let id = payload.id;
            let orgID = payload.org_id;
            const user = await modelUser.select('*').where({
                id: id,
                org_id: orgID
            }).first();
            if (!user)
            {
                Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
            }else{
                const org = await  modelOrg.getOrgByID(orgID);
                ctx.meta.isAuthencated = true;
                ctx.meta.userInfo = user;
                ctx.meta.orgInfo = org;
                ctx.meta.test = "456";
            }
            modelUser.DB.destroy();
            modelOrg.DB.destroy();
        } catch (error) {
            throw new Errors.MoleculerError( error.toString() );
        }
    }
}
export default new Middleware();
