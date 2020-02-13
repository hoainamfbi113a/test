const { MoleculerError } = require("moleculer").Errors;
const ERR_INVALID_TOKEN = "ERR_INVALID_TOKEN";
class UnAuthorizedError extends MoleculerError {
  /**
   * Creates an instance of UnAuthorizedError.
   *
   * @param {String} type
   * @param {any} data
   *
   * @memberOf UnAuthorizedError
   */
  constructor(type: any, data: any) {
    super("Unauthorized", 401, type || ERR_INVALID_TOKEN, data);
  }
}

// tslint:disable-next-line: max-classes-per-file
class BadRequestError extends MoleculerError {
  constructor(type: any, data: any) {
    super("Bad Request", 400, type || "ERR_INVALID_FORMAT", data);
  }
}

module.exports = { UnAuthorizedError, BadRequestError };
