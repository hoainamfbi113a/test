import middlewares from '../../src/middlewares';
export const apiRouter = {
    path: "/api",
    whitelist: [
        // Access to any actions in all services under "/api" URL
        "**",
    ],
    // tslint:disable-next-line:object-literal-sort-keys
    authentication: true,
    // Call before `broker.call`
    async onBeforeCall(ctx: any, route: any, req: any, res: any) {
        return await middlewares.authentication(ctx, route, req, res);
    },
};
