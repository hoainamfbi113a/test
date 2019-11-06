"use strict";
import { ServiceSchema } from "moleculer";
require("dotenv").config();

const TestService: ServiceSchema = {
	name: "test",

	/**
	 * Service settings
	 */
	settings: {
		routes: [{
			// First thing
			authorization: true,
		}],
	},

	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Say a 'Hello'
		 *
		 * @returns
		 */
		async hello() {
			console.log(123123);
			const res = await this.broker.call("greeter.hello", { });
			return res;
		},

		/**
		 * Welcome a username
		 *
		 * @param {String} name - User name
		 */
		welcome: {
			params: {
				name: "string",
			},
			handler(ctx) {
				return `Welcome, ${ctx.params.name}`;
			},
		},
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	// async started() {

	// },

	/**
	 * Service stopped lifecycle event handler
	 */
	// async stopped() {

	// },
};

export = TestService;
