const errors = require('../errors');
const utils = require('../utils');
const uuid = require('uuid');
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
        var token = utils.decodeToken(req.headers.authorization);
        let user = await request.get(`http://localhost:7071/api/users/${token._id}`, { //Get User
            json: true,
            headers: {
                'authorization': req.headers.authorization
            }
        });

        let isValidMerchant = false;
        for (let i = 0; i < user.merchants.length; i++) {
            if (user.merchants[i].merchantID == req.params.parentMerchantID) {
                isValidMerchant = true;
            }
        }

        if (!uuid.validate(req.params.parentMerchantID)) {
            utils.setContextResError(
                context,
                new errors.InvalidUUIDError(
                    'The parentMerchantID specified in the URL does not match the UUID v4 format.',
                    400
                )
            )
            return Promise.resolve();
        }

        if (!uuid.validate(req.params.childID)) {
            utils.setContextResError(
                context,
                new errors.InvalidUUIDError(
                    'The childID specified in the URL does not match the UUID v4 format.',
                    400
                )
            )
            return Promise.resolve();
        }

        if (!isValidMerchant) {
            utils.setContextResError(
                context,
                new errors.UserNotAuthenticatedError(
                    'user not linked to merchant',
                    401
                )
            )
            return Promise.resolve();
        }

        const result = await request.get(`http://localhost:7070/api/get-one-child-merchant/${req.params.parentMerchantID}/child/${req.params.childID}`, {
            json: true,
            headers: {
                'x-functions-key': process.env.DEVICE_API_KEY
            }
        });

        context.res = {
            body: result
        };
        return Promise.resolve()
    } catch (err) {
        utils.handleError(context, err);
    }
}