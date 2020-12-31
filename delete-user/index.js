const errors = require('../errors');
const utils = require('../utils');
const request = require('request-promise');
const uuid = require('uuid');
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
        if (!uuid.validate(req.params.userID)) {
            utils.setContextResError(
                context,
                new errors.InvalidUUIDError(
                    'The userID specified in the URL does not match the UUID v4 format.',
                    400
                )
            )
            return Promise.resolve();
        }

        const result = await request.delete(`http://localhost:7070/api/delete-user/${req.params.userID}`, {
            json: true,
            body: req.body,
            headers: {
                'x-functions-key': process.env.USER_API_KEY
            }
        });
        context.res = {
            body: result
        }
    } catch (error) {
        utils.handleError(context, error);
    }
}