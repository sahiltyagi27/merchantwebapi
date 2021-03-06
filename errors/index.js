
class BaseError extends Error {
    constructor (message, code) {
        super(message);
        this.name = 'ConsumerApiFunctionsBaseError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

exports.BaseError = BaseError;


class UserNotAuthenticatedError extends BaseError {
    constructor (message, code) {
        super(message);
        this.name = 'UserNotAuthenticatedError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.UserNotAuthenticatedError = UserNotAuthenticatedError;

class EmptyRequestBodyError extends BaseError {
    constructor (message, code) {
        super(message);
        this.name = 'EmptyRequestBodyError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.EmptyRequestBodyError = EmptyRequestBodyError;

class MissingMerchantID extends BaseError {
    constructor (message, code) {
        super(message);
        this.name = 'MissingMerchantID';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.MissingMerchantID = MissingMerchantID;


class FieldValidationError extends BaseError {
    constructor (message, code) {
        super(message);
        this.name = 'FieldValidationError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.FieldValidationError = FieldValidationError;

class MerchantWebApiServerError extends BaseError {
    constructor (name, message, code) {
        super(message, code);
        this.name = name;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.MerchantWebApiServerError = MerchantWebApiServerError;

class InvalidUUIDError extends BaseError {
    constructor (message, code) {
        super(message, code);
        this.name = 'InvalidUUIDError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.InvalidUUIDError = InvalidUUIDError;
