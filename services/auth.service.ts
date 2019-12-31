//#region Global Imports
import jwtService from "BaseService/services/jwt.service";
import { IAuth } from "Interfaces";
import {Context, Errors, ServiceSchema} from "moleculer";
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
                isError: true,
                message: "Email not register",
                code: "email_not_register",
            };
        }
        if (!user.activated) {
            return {
                isError: true,
                message: "user not active",
                code: "user_not_active",
            };
        }

        const check = await jwtService.compare(password, user.password);
        if (!check) {
            return {
                isError: true,
                message: "Wrong password",
                code: "wrong_password",
            };
        }

        const orgModel = new ModelOrganization(ctx);
        const org = await orgModel.getOrgByID(user.org_id);

        const token = await jwtService.sign({
            id: user.id,
            email: user.email,
            org_id: user.org_id,
        });
        delete user.password;
        return {
            isError: false,
            userInfo: {...user, companyName: user.company_name},
            companyName: org.company_name,
            token,
        };
    }
}

module.exports = new AuthService();
