const errors = require('../errors');
const utils = require('../utils');
const request = require('request-promise');


module.exports = async function (context, req) {
    try {
        if (!req.body) {
            utils.setContextResError(
                context,
                new errors.EmptyRequestBodyError(
                    'You\'ve requested to create a new user but the request body seems to be empty. Kindly pass the user to be created using request body in application/json format',
                    400
                )
            )
            return Promise.resolve();
        }

        const result = await request.post('http://localhost:7070/api/signup', {
            json: true,
            body: req.body
        });
        context.res = {
            body: result
        }
    } catch (error) {
        utils.handleError(context, error);
    }
}