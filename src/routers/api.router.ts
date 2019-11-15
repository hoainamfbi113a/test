import middlewares from '../../src/middlewares';
export const apiRouter = {
    path: "/api",
    whitelist: [
        // Access to any actions in all services under "/api" URL
        "**",
    ],
    // tslint:disable-next-line:object-literal-sort-keys
    authentication: true
};