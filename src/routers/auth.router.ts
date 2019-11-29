export const authRouter = {
    path: "/auth",
    whitelist: [
        "auth.*",
        "user.*",
        "org.*",
    ],
    mappingPolicy: "restrict",
    aliases: {
        "POST login": "auth.login",
        "POST user/registerByOrg": "org.create",
        "POST user/activeByOrg": "org.activate",
        "POST user/checkEmailExist": "user.checkEmailExist"
    },
    bodyParsers: {
        json: true
    },
    authentication: false
};
