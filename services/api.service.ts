import { ServiceMethods, ServiceSchema, ServiceSettingSchema } from "moleculer";
import ApiGateway = require("moleculer-web");
import { routers } from "../src/routers";
import middlewares from "../src/middlewares";

class ApiService implements ServiceSchema {
	public name: string = "api";
	public mixins: Array<ServiceSchema> = [ApiGateway];
	public dependencies: Array<string> = ['auth', 'org', 'plugin', 'user'];
	public settings: ServiceSettingSchema = {
		port: process.env.PORT || 3000,
		// Global CORS settings
		cors: {
			origin: "*",
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
			allowedHeaders: "*",
			//exposedHeaders: "*",
			credentials: true,
			maxAge: null
		},
		routes: routers,
		// Serve assets from "public" folder
		// tslint:disable-next-line:object-literal-sort-keys
		assets: {
			folder: "public",
		},
		// Global error handler
		onError(_req: any, res: any, err: any) {
			this.logger.info({
				message: err.message,
				stackTrace: err.stack
			}
			);
			res.setHeader("Content-Type", "application/json; charset=utf-8");
			res.writeHead(err.code || 500);
			res.end(JSON.stringify({
				message: err.message,
			}));
		}
	};

	public methods: ServiceMethods = {
		async authenticate(ctx: any, route: any, req: any, res: any) {
			return await middlewares.authentication(ctx, route, req, res);
		}
	}
}
module.exports = new ApiService();
