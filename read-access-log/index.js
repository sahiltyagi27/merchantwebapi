const errors = require('../errors');
const utils = require('../utils');
const request = require('request-promise');
module.exports = async function (context, req) {

    try {

        /*   if (!utils.authenticateRequest(req, res, next)) {
               errors.UserNotAuthenticatedError(req, res, next);
           }*/
        /*const user = {

            merchants: [
                { merchantID: '12358cfa-063d-4f5c-be5d-b90cfb64d1d6' },
                { merchantID: '12358cfa-063d-4f5c-be5d-b90cfb64d1d7' },
                { merchantID: '12358cfa-063d-4f5c-be5d-b90cfb64d1d8' }
            ],

        };*/

        let isValidMerchant = false;
        for (var i = 0, len = user.merchants.length; i < len; i++) {
            if (user.merchants[i].merchantID === req.query.merchantID) {   //Validate whether user is allowed to see merchant data or not?
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
        const result = await request.get(`${process.env.DEVICE_API_URL}/api/${process.env.DEVICE_API_VERSION}/merchants/${req.params.id}/access-log/${req.params.accessLogID}`, {
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