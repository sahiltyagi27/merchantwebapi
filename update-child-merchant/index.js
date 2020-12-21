const errors = require('../errors');
const utils = require('../utils');
const request = require('request-promise');
module.exports = async function (context, req) {
    try {

        /*   if (!utils.authenticateRequest(req, res, next)) {
               errors.UserNotAuthenticatedError(req, res, next);
           }*/

        if (!req.body) {
            utils.setContextResError(
                context,
                new errors.EmptyRequestBodyError(
                    'You\'ve requested to update a child merchant but the request body seems to be empty. Kindly pass the child merchant to be updated using request body in application/json format',
                    400
                )
            );
            return Promise.resolve();
        }
        const user = {

            merchants: [
                { merchantID: '2cc58cfa-063d-4f5c-be5d-b90cfb64d1d6' },
                { merchantID: '12358cfa-063d-4f5c-be5d-b90cfb64d1d7' },
                { merchantID: '12358cfa-063d-4f5c-be5d-b90cfb64d1d8' }
            ],

        };

        let isValidMerchant = false;
        for (let i = 0; i < user.merchants.length; i++) {
            if (user.merchants[i].merchantID == req.query.parentMerchantID) {
                isValidMerchant = true;
            }
        }
        const result = await request.put(`http://localhost:7070/api/update-child-merchant/${req.params.parentMerchantID}/child/${req.params.childID}`, {
            body: req.body,
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