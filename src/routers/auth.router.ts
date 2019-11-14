export const authRouter = {
    path: "/auth",
    whitelist: [
        // Access to any actions in all services under "/api" URL
        "auth.*",
        "user.*",
    ],
    aliases: {
        // Call `auth.login` action with `GET /login` or `POST /login`
        "POST login": "auth.login"
    },
    authentication: false
};
