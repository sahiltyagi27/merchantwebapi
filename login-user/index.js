const utils = require('../utils');
const errors = require('../errors');
const request = require('request-promise');

module.exports = async function (context, req) {
    try {
        if (!req.body) {
            utils.setContextResError(
                context,
                new errors.EmptyRequestBodyError(
                    'You have requested to authenticate a user but the request body seems to be empty. Kindly pass the user to be authenticated using request body in application/json format',
                    400
                )
            )
            return Promise.resolve();
        }
        const token = await request.post('http://localhost:7070/api/login-user', {
            json: true,
            body: req.body,
            headers: {
                'x-functions-key': process.env.USER_API_KEY
            }
        });

        context.log('Logged In successfully');
        context.res = {
            body: token
        }
        return Promise.resolve();
    } catch (error) {
        utils.handleError(context, error);
    }
}