import { apiRouter } from "./api.router";
import { authRouter } from "./auth.router";
import { fileRouter } from "./file.router";

export const routers = [{ ...apiRouter }, { ...authRouter }, { ...fileRouter }];
