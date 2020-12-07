const errors = require('../errors');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const utils = require('../utils');

module.exports = async function (context, req) {
    try {

        /*   if (!utils.authenticateRequest(req, res, next)) {
               errors.UserNotAuthenticatedError(req, res, next);
           }*/

        if (!req.body) {
            utils.setContextResError(
                context,
                new errors.EmptyRequestBodyError(
                    'You\'ve requested to create a new access-log but the request body seems to be empty. Kindly pass the access-log to be created using request body in application/json format',
                    400
                )
            );
            return Promise.resolve();
        }

        if (!req.body.posMerchantID && !req.body.tokenMerchantID) {
            utils.setContextResError(
                context,
                new errors.FieldValidationError(
                    'Please send MerchantID in req body.',
                    401
                )
            );
            return Promise.resolve();
        }

        const user = {

            merchants: [
                { merchantID: '12358cfa-063d-4f5c-be5d-b90cfb64d1d6' },
                { merchantID: '12358cfa-063d-4f5c-be5d-b90cfb64d1d7' },
                { merchantID: '12358cfa-063d-4f5c-be5d-b90cfb64d1d8' }
            ],

        };

        let isMerchantLinked = false;

        for (var i = 0, len = user.merchants.length; i < len; i++) {
            if (user.merchants[i].merchantID === req.body.posMerchantID || user.merchants[i].merchantID === req.body.tokenMerchantID) {   //Validate whether user is allowed to see merchant data or not?
                isMerchantLinked = true;
            }
        }
        if (!isMerchantLinked) {
            utils.setContextResError(
                context,
                new errors.UserNotAuthenticatedError(
                    'MerchantID not linked to user',
                    401
                )
            );
            return Promise.resolve();
        }



        await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function (err, db) {

            try {
                if (err) throw err;
            }
            catch (err) {

            }

            var dbo = db.db("mydb");
            const result = dbo.collection("accesslogs").insertOne(req.body, function (err, res) {

                try {
                    if (err) throw err;
                }
                catch (err) {

                }

                console.log("access log created and added");
                db.close();
            });
            context.res = {
                body: result
            };
            return Promise.resolve();

        });
    }
    catch (err) {
        utils.handleError(context, err);
    }
}