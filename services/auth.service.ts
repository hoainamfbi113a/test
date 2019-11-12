//#region Global Imports
import {Context, ServiceSchema, Errors} from "moleculer";
import { Action } from "moleculer-decorators";
import { IAuth } from 'Interfaces';
import {ModelOrganization, ModelUser} from "../src/models";
import jwtService from "BaseService/services/jwt.service";

class AuthService implements ServiceSchema{
	public name: string = 'auth';

	@Action({
		params: {
			email: { type: "string" },
			password: { type: "string", min: 1 }
		}
	})
	public async login(ctx: Context<IAuth.Login>): Promise<any> {
		const { email, password } = ctx.params;
		const modelUser = new ModelUser(ctx);
        let user = await modelUser.getUserByEmail(email);
        if (!user) {
            throw new Errors.MoleculerError('Email not register',402);
        }
        if (!user.activated) {
            throw new Errors.MoleculerError('user not active',402);
        }

        let check = await jwtService.compare(password, user.password);
        if (!check) {
            throw new Errors.MoleculerError('Wrong password',402);
        }

        const orgModel = new ModelOrganization(ctx);
        const org = await orgModel.getOrgByID(user.org_id);

        const token = await jwtService.sign({
            id: user.id,
            email: user.email,
            org_id: user.org_id
        });
        delete user.password;
        return {
            ...user,
            companyName: org.companyName,
            token
        };
	}
}

module.exports = new AuthService();
