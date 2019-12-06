import middlewares from '../../src/middlewares';
export const apiRouter = {
    path: "/api",
    whitelist: [
        // Access to any actions in all services under "/api" URL
        "**",
    ],
    mappingPolicy: "restrict",
    aliases: {
        "GET plugin": "plugin.getOrgPlugins",
        "GET plugin/master": "plugin.getAllMaster"
    },
    bodyParsers: {
        json: true
    },
    // tslint:disable-next-line:object-literal-sort-keys
    authentication: true
};
