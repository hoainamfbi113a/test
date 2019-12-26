export const authRouter = {
    path: "/v2/auth",
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
        "POST user/checkEmailExist": "user.checkEmailExist",
        "POST user/forgotPassword": "user.forgotPassword",
        "POST user/checkUserVerifyCode": "user.checkUserVerifyCode",
        "POST user/resetPassword": "user.resetPassword"
    },
    bodyParsers: {
        json: true
    },
    authentication: false
};
