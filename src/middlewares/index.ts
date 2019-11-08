import jwtService from "base-service/dist/services/jwt.service";
const { UnAuthorizedError, ERR_NO_TOKEN } = require("base-service/dist/services/errors");

class Middleware {
    authentication = async (ctx: any, route: any, req: any, res: any) => {
        try {
            // Verify JWT token
            let token;
            console.log(await jwtService.verify(req.headers.token));
            console.log(req.headers.token);
            if (req.headers.authorization) {
                const type = req.headers.authorization.split(" ")[0];
                if (type === "Token") {
                    token = req.headers.authorization.split(" ")[1];
                }
            }
            if (!token) {
                return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
            }
            // Verify JWT token
            return ctx.call("auth.resolveToken", { token })
                .then((user: any) => {
                    return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
                });
        } catch (error) {
            throw error
        }
    }
}
export default new Middleware();
