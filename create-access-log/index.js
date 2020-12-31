const errors = require('../errors');
const utils = require('../utils');
const request = require('request-promise');
module.exports = async function (context, req) {
    try {

        if (!utils.authenticateRequest(context, req)) {
            utils.setContextResError(
                context,
                new errors.UserNotAuthenticatedError(
                    'Unable to authenticate user.',
                    401
                )
            );
            return Promise.reject();
        }

        if (!req.body) {
            utils.setContextResError(
                context,
                new errors.EmptyRequestBodyError(
                    'You\'ve requested to create a new access-log but the request body seems to be empty. Kindly pass the access-log to be created using request body in application/json format',
                    400
                )
            );
            return Promise.resolve();
        }

        if (!req.body.posMerchantID && !req.body.tokenMerchantID) {
            utils.setContextResError(
                context,
                new errors.FieldValidationError(
                    'Please send MerchantID in req body.',
                    401
                )
            );
            return Promise.resolve();
        }

        var token = utils.decodeToken(req.headers.authorization);
        let user = await request.get(`http://localhost:7071/api/users/${token._id}`, { //Get User
            json: true,
            headers: {
                'authorization': req.headers.authorization
            }
        });

        let isMerchantLinked = false;

        for (var i = 0, len = user.merchants.length; i < len; i++) {
            if (user.merchants[i].merchantID === req.body.posMerchantID || user.merchants[i].merchantID === req.body.tokenMerchantID) {   //Validate whether user is allowed to see merchant data or not?
                isMerchantLinked = true;
            }
        }
        if (!isMerchantLinked) {
            utils.setContextResError(
                context,
                new errors.UserNotAuthenticatedError(
                    'MerchantID not linked to user',
                    401
                )
            );
            return Promise.resolve();
        }
        const result = await request.post(`http://localhost:7070/api/access-log`, {
            body: req.body,
            json: true,
            headers: {
                'x-functions-key': process.env.DEVICE_API_KEY
            }
        });
        context.res = {
            body: result
        };

    }
    catch (err) {
        utils.handleError(context, err);
    }
}