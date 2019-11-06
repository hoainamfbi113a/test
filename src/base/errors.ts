/*
 * moleculer
 * Copyright (c) 2019 MoleculerJS (https://github.com/moleculerjs/moleculer)
 * MIT Licensed
 */

"use strict";

// tslint:disable-next-line:no-var-requires
const { MoleculerError, MoleculerClientError } = require("moleculer").Errors;

const ERR_NO_TOKEN = "NO_TOKEN";
const ERR_INVALID_TOKEN = "INVALID_TOKEN";
const ERR_UNABLE_DECODE_PARAM = "UNABLE_DECODE_PARAM";
const ERR_ORIGIN_NOT_FOUND = "ORIGIN_NOT_FOUND";
const ERR_ORIGIN_NOT_ALLOWED = "ORIGIN_NOT_ALLOWED";
const NOT_SIGN_TOKEN = "NOT SIGN TOKEN";

/**
 * Invalid request body
 *
 * @class InvalidRequestBodyError
 * @extends {Error}
 */
class InvalidRequestBodyError extends MoleculerError {
    /**
     * Creates an instance of InvalidRequestBodyError.
     *
     * @param {any} body
     * @param {any} error
     *
     * @memberOf InvalidRequestBodyError
     */
    constructor({body, error}: { body: any, error: any }) {
        super("Invalid request body", 400, "INVALID_REQUEST_BODY", {
            body,
            error,
        });
    }
}

/**
 * Invalid response type
 *
 * @class InvalidResponseTypeError
 * @extends {Error}
 */
// tslint:disable-next-line:max-classes-per-file
class InvalidResponseTypeError extends MoleculerError {
    /**
     * Creates an instance of InvalidResponseTypeError.
     *
     * @param {String} dataType
     *
     * @memberOf InvalidResponseTypeError
     */
    constructor({dataType}: { dataType: any }) {
        super(`Invalid response type '${dataType}'`, 500, "INVALID_RESPONSE_TYPE", {
            dataType,
        });
    }
}

/**
 * Unauthorized HTTP error
 *
 * @class UnAuthorizedError
 * @extends {Error}
 */
// tslint:disable-next-line:max-classes-per-file
class UnAuthorizedError extends MoleculerError {
    /**
     * Creates an instance of UnAuthorizedError.
     *
     * @param {String} type
     * @param {any} data
     *
     * @memberOf UnAuthorizedError
     */
    constructor({type, data}: { type: any, data: any }) {
        super("Unauthorized", 401, type || ERR_INVALID_TOKEN, data);
    }
}

/**
 * Forbidden HTTP error
 *
 * @class ForbiddenError
 * @extends {Error}
 */
// tslint:disable-next-line:max-classes-per-file
class ForbiddenError extends MoleculerError {
    /**
     * Creates an instance of ForbiddenError.
     *
     * @param {String} type
     * @param {any} data
     *
     * @memberOf ForbiddenError
     */
    constructor({type, data}: { type: any, data: any }) {
        super("Forbidden", 403, type, data);
    }
}

/**
 * Bad request HTTP error
 *
 * @class BadRequestError
 * @extends {Error}
 */
// tslint:disable-next-line:max-classes-per-file
class BadRequestError extends MoleculerError {
    /**
     * Creates an instance of BadRequestError.
     *
     * @param {String} type
     * @param {any} data
     *
     * @memberOf BadRequestError
     */
    constructor({type, data}: { type: any, data: any }) {
        super("Bad request", 400, type, data);
    }
}

/**
 * Not found HTTP error
 *
 * @class NotFoundError
 * @extends {Error}
 */
// tslint:disable-next-line:max-classes-per-file
class NotFoundError extends MoleculerError {
    /**
     * Creates an instance of NotFoundError.
     *
     * @param {String} type
     * @param {any} data
     *
     * @memberOf NotFoundError
     */
    constructor({type, data}: { type: any, data: any }) {
        super("Not found", 404, type || "NOT_FOUND", data);
    }
}

/**
 * Rate limit exceeded HTTP error
 *
 * @class RateLimitExceeded
 * @extends {Error}
 */
// tslint:disable-next-line:max-classes-per-file
class RateLimitExceeded extends MoleculerClientError {
    /**
     * Creates an instance of RateLimitExceeded.
     *
     * @param {String} type
     * @param {any} data
     *
     * @memberOf RateLimitExceeded
     */
    constructor({type, data}: { type: any, data: any }) {
        super("Rate limit exceeded", 429, type, data);
    }
}

/**
 * Service unavailable HTTP error
 *
 * @class ForbiddenError
 * @extends {Error}
 */
// tslint:disable-next-line:max-classes-per-file
class ServiceUnavailableError extends MoleculerError {
    /**
     * Creates an instance of ForbiddenError.
     *
     * @param {String} type
     * @param {any} data
     *
     * @memberOf ForbiddenError
     */
    constructor({type, data}: { type: any, data: any }) {
        super("Service unavailable", 503, type, data);
    }
}

module.exports = {
    InvalidRequestBodyError,
    InvalidResponseTypeError,
    UnAuthorizedError,
    // tslint:disable-next-line:object-literal-sort-keys
    ForbiddenError,
    BadRequestError,
    NotFoundError,
    RateLimitExceeded,
    ServiceUnavailableError,

    ERR_NO_TOKEN,
    ERR_INVALID_TOKEN,
    ERR_UNABLE_DECODE_PARAM,
    ERR_ORIGIN_NOT_FOUND,
    ERR_ORIGIN_NOT_ALLOWED,
};
