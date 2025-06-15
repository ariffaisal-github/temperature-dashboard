/**
 *  This class is used to create custom error objects with a message and a status code.
 * @class CustomError
 * @extends Error
 * @param {string} message - The error message.
 * @param {number} statusCode - The HTTP status code associated with the error.
 * @example
 * const error = new CustomError("Not Found", 404);
 */
export class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
