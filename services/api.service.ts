import { ServiceSchema } from "moleculer";
import ApiGateway = require("moleculer-web");
import {routers} from "../src/routers";

const ApiService: ServiceSchema = {
	name: "api",

	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
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

	},
};
export = ApiService;
