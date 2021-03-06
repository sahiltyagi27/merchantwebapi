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
        const user = await request.get(`http://localhost:7071/api/users/${token._id}`, { //Get User
            json: true,
            headers: {
                'authorization': req.headers.authorization
            }
        });
        
        let isValidMerchant = false;
        for (var i = 0, len = user.merchants.length; i < len; i++) {
            if (user.merchants[i].merchantID === req.params.merchantID) {   //Validate whether user is allowed to see merchant data or not?
                isValidMerchant = true;
            }
        }

        if (!uuid.validate(req.params.merchantID)) {
            utils.setContextResError(
                context,
                new errors.InvalidUUIDError(
                    'The MerchantID specified in the URL does not match the UUID v4 format.',
                    400
                )
            )
            return Promise.resolve();
        }

        if (!isValidMerchant) {
            utils.setContextResError(
                context,
                new errors.UserNotAuthenticatedError(
                    'MerchantID not linked to user',
                    401
                )
            );
            return Promise.resolve();
        }
        const result = await request.get(`http://localhost:7070/api/read-access-log/merchants/${req.params.merchantID}/filters/${req.params.filter}/value/${req.params.filterValue}`, {
            json: true,
            headers: {
                'x-functions-key': process.env.DEVICE_API_KEY
            }
        });


        context.res = {
            body: result
        };
        return Promise.resolve();


    } catch (err) {
        utils.handleError(context, err);
    }
}