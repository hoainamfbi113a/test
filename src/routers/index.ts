import { apiRouter } from './api.router';
import { mobileRouter } from './mobile.router';
import { authRouter } from './auth.router';

export const routers = [
    { ...apiRouter },
    { ...authRouter },
    { ...mobileRouter },
];
