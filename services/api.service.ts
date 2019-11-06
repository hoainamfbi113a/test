import jwtService from "base-service/dist/services/jwt.service";
import { ServiceSchema } from "moleculer";
import ApiGateway = require("moleculer-web");
// tslint:disable-next-line:no-var-requires
const { UnAuthorizedError, ERR_NO_TOKEN } = require("base-service/dist/services/errors");

const ApiService: ServiceSchema = {
	name: "api",

	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 3000,

		routes: [{
			path: "/api",
			whitelist: [
				// Access to any actions in all services under "/api" URL
				"**",
			],
			// tslint:disable-next-line:object-literal-sort-keys
			authentication: true,
			// Call before `broker.call`
			async onBeforeCall(ctx: any, route: any, req: any, res: any) {
				// Verify JWT token
				let token;
				console.log(await jwtService.verify(req.headers.token));
				console.log(req.headers.token);
				if (req.headers.authorization) {
					const type = req.headers.authorization.split(" ")[0];
					if (type === "Token") {
						token = req.headers.authorization.split(" ")[1];
					}
				}
				if (!token) {
					return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
				}
				// Verify JWT token
				return ctx.call("auth.resolveToken", { token })
					.then((user: any) => {
						return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
					});
			},
		}],
		// Serve assets from "public" folder
		// tslint:disable-next-line:object-literal-sort-keys
		assets: {
			folder: "public",
		},
	},
};
export = ApiService;
