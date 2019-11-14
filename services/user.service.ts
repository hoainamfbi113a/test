//#region Global Imports
import { ServiceSchema } from "moleculer";
import { Action } from "moleculer-decorators";

class UserService implements ServiceSchema{
	public name: string = 'user';

	@Action()
	public async checkEmailExist(ctx: any): Promise<any> {
        return "checkEmailExist";
	}

	@Action()
	public async registerByOrg(ctx: any): Promise<any> {
		return "registerByOrg";
	}

	@Action()
	public async activeByOrg(ctx: any): Promise<any> {
		return "activeByOrg";
	}
}

module.exports = new UserService();
