import compression from "compression";
export const apiRouter = {
    path: "/api",
    whitelist: [
        // Access to any actions in all services under "/api" URL
        "**",
    ],
    aliases: {
    },
    use: [compression()],
    bodyParsers: {
        json: true
    },
    // tslint:disable-next-line:object-literal-sort-keys
    authentication: true,
    autoAliases: true
};
