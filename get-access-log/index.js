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
        var token = utils.decodeToken(req.headers.authorization);
        let user = await request.get(`http://localhost:7071/api/users/${token._id}`, { //Get User
            json: true,
            headers: {
                'authorization': req.headers.authorization
            }
        });

        let isValidMerchant = false;
        for (var i = 0; i < user.merchants.length; i++) {
            if (user.merchants[i].merchantID === req.params.merchantID) {   //Validate whether user is allowed to see merchant data or not?
                isValidMerchant = true;
            }
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
        const result = await request.get(`http://localhost:7070/api/get-access-log/merchants/${req.params.merchantID}/access-log/${req.params.accessLogID}`, {
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