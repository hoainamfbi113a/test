import compression from "compression";
export const apiRouter = {
    path: "/v2",
    whitelist: [
        // Access to any actions in all services under "/api" URL
        "**",
    ],
    aliases: {
        "actions": "$node.actions"
    },
    use: [compression()],
    bodyParsers: {
        json: true
    },
    // tslint:disable-next-line:object-literal-sort-keys
    authentication: true,
    autoAliases: true
};
