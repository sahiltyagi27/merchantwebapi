const errors = require('../errors');
const utils = require('../utils');
const request = require('request-promise')
const uuid = require('uuid');
module.exports = async function (context, req) {
    try {

        /*   if (!utils.authenticateRequest(req, res, next)) {
               errors.UserNotAuthenticatedError(req, res, next);
           }*/
        const user = {

            merchants: [
                { merchantID: '2cc58cfa-063d-4f5c-be5d-b90cfb64d1d6' },
                { merchantID: '12358cfa-063d-4f5c-be5d-b90cfb64d1d7' },
                { merchantID: '12358cfa-063d-4f5c-be5d-b90cfb64d1d8' }
            ],

        };
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
        let isValidMerchant = false;
        for (let i = 0; i < user.merchants.length; i++) {
            if (user.merchants[i].merchantID == req.params.parentMerchantID) {
                isValidMerchant = true;
            }
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

        const result = await request.get(`http://localhost:7070/api/get-child-merchants/${req.params.parentMerchantID}`, {
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