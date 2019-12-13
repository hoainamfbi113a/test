import { apiRouter } from './api.router';
import { authRouter } from './auth.router';

export const routers = [
    {...apiRouter},
    {...authRouter},
];
