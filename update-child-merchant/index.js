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