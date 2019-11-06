import * as fs from 'fs';
import * as path from 'path';
import { bcrypt, jwt } from '../lib';
const { UnAuthorizedError, ERR_INVALID_TOKEN, NOT_SIGN_TOKEN } = require("./errors");
import { IObject } from '../interfaces/common';
const secretOrPrivateKey = fs.readFileSync(path.join(__dirname, '../config/key/private.key'));
const secretOrPublicKey = fs.readFileSync(path.join(__dirname, '../config/key/public.key'));
const saltRounds = 10;
class JWTService {
    private privateKey;
    private publicKey;
    constructor(privateKey, publicKey) {
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }
    verify = (token: string, options: IObject<any> = {}): Promise<any> => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.privateKey, {
                algorithms: ['HS256']
            }, (err, decoded) => {
                if (err) {
                    reject(new UnAuthorizedError(ERR_INVALID_TOKEN));
                } else {
                    resolve(decoded);
                }
            });
        });
    }
    sign = (payload: string | Buffer | object, options: IObject<any> = {}): Promise<string> => {
        return new Promise((resolve, reject) => {
            jwt.sign({ payload }, this.privateKey, options || {
                algorithm: 'HS256',
                expiresIn: '10h'
            }, (err, decoded) => {
                if (err) {
                    reject(new UnAuthorizedError(NOT_SIGN_TOKEN));
                } else {
                    resolve(decoded);
                }
            });
        });

    }
    hash = (payload: string): Promise<string> => {
        return bcrypt.hash(payload, saltRounds);
    }
    compare = (payload: string, hash: string): Promise<boolean> => {
        return bcrypt.compare(payload, hash);
    }
}
export default new JWTService(secretOrPrivateKey, secretOrPublicKey);
