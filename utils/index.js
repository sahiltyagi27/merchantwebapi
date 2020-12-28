const jwt = require('jsonwebtoken');
require('dotenv').config();
const { voucherApiErrorCodes } = require('../errors/api-error-codes')
const errors = require('../errors');
exports.authenticateRequest = (context, req) => {
    if (req.headers.authorization) {
        try {
            if (this.decodeToken(req.headers.authorization).exp <= new Date()) {
                return true;
            }
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
};
exports.decodeToken = (token) => {
    try {
        const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
        return decodedToken;
    } catch (e) {
        return e;
    }
};

exports.handleError = (context, error) => {
    context.log.error(error);
    switch (error.constructor) {
        case errors.ActionCodeFormatError:
        case errors.PriceplanNotFoundError:
        case errors.InvalidUUIDError:
        case errors.StripeError:
            this.logKnownErrors(context, error);
            this.setContextResError(context, error);
            break;
        default:
            this.handleDefaultError(context, error);
            break;
    }
};

exports.logKnownErrors = (context, error) => {
    if (process.env.LOG_KNOWN_ERRORS === 'true') {
        this.logError(context, error);
    }
};

exports.setContextResError = (context, error) => {
    const body = {
        code: error.code,
        description: error.message,
        reasonPhrase: error.name
    };

    context.res = {
        status: error.code,
        body: body
    };

    if (error.name !== 'StripeError') {
        console.log(body);
    }
};

exports.handleDefaultError = (context, error) => {
    console.log(error.error);
    if (error.type === 'StripeInvalidRequestError') {
        let message;
        if (error.message) {
            message = error.message;
        } else {
            message = 'StripeInvalidRequestError';
        }
        this.setContextResError(
            context,
            new errors.StripeError(
                message,
                error.statusCode
            )
        );
    } else {
        const response = error.error;
        if (response && response.reasonPhrase) {
            if (voucherApiErrorCodes.includes(response.reasonPhrase)) {
                const errorFormatted = new errors.VoucherApiError(
                    response.reasonPhrase,
                    response.description,
                    response.code
                );

                this.setContextResError(
                    context,
                    errorFormatted
                );
                this.logKnownErrors(context, errorFormatted);
            } else {
                handleMerchantWebApiServerError(error, context);
            }
        } else {
            handleMerchantWebApiServerError(error, context);
        }
    }
};

const handleMerchantWebApiServerError = (error, context) => {
    const errorFormatted = new errors.MerchantWebApiServerError(error.name, error.error.description || error, error.statusCode);
    this.logError(context, errorFormatted);
    this.setMerchantWebApiContextResError(context, error.error, error.statusCode);
};

exports.setMerchantWebApiContextResError = (context, error) => {
    const body = {
        code: error.code,
        description: error.description,
        reasonPhrase: error.reasonPhrase
    };

    context.res = {
        status: error.code,
        body: body
    };

    console.log(body);
};

exports.logError = (context, error) => {
    const executionContext = context.executionContext;
    context.log.info({
        invocationId: executionContext.invocationId,
        functionName: executionContext.functionName,
        code: error.code,
        description: error.message,
        reasonPhrase: error.name,
        timestamp: new Date()
    });
};
