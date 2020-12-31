const utils = require('../utils')
const errors = require('../errors')
const promise = require('request-promise');
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
            return Promise.resolve();
        }
        let user = await request.get(`http://localhost:7070/api/users/${req.params.userID}`, {
            json: true,
            body: req.body,
            headers: {
                'x-functions-key': process.env.USER_API_KEY
            }
        });
        context.res = {
            body: user
        }
        return Promise.resolve()
    }
    catch {
        (error => utils.handleError(error))
    }
}
