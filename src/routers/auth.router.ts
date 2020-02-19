export const authRouter = {
  aliases: {
    "POST login": "auth.login",
    "POST user/activeAccount": "user.activateWithoutOrg",
    "POST user/activeByOrg": "org.activate",
    "POST user/checkEmailExist": "user.checkEmailExist",
    "POST user/checkUserVerifyCode": "user.checkUserVerifyCode",
    "POST user/forgotPassword": "user.forgotPassword",
    "POST user/registerByOrg": "org.create",
    "POST user/resetPassword": "user.resetPassword",
  },
  authentication: false,
  bodyParsers: {
    json: true,
  },
  mappingPolicy: "restrict",
  path: "/v2/auth",
  whitelist: ["auth.*", "user.*", "org.*"],
};
