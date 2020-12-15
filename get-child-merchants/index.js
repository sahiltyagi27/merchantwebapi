const errors = require('../errors');
const utils = require('../utils');
const { database } = require('../db/mongodb')
module.exports = async function (context, req) {
    try {

        /*   if (!utils.authenticateRequest(req, res, next)) {
               errors.UserNotAuthenticatedError(req, res, next);
           }*/
        let collection = database.collection("merchants");
        const user = {

            merchants: [
                { merchantID: '2cc58cfa-063d-4f5c-be5d-b90cfb64d1d6' },
                { merchantID: '12358cfa-063d-4f5c-be5d-b90cfb64d1d7' },
                { merchantID: '12358cfa-063d-4f5c-be5d-b90cfb64d1d8' }
            ],

        };

        let isValidMerchant = false;
        for (let i = 0; i < user.merchants.length; i++) {
            if (user.merchants[i].merchantID == req.query.id) {
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

        let docs = await collection.find({ parentMerchantID: { $eq: req.query.id } }).limit(200).toArray();
        console.log("Found the following records");
        console.log(docs)
        return Promise.resolve();

    } catch (err) {
        utils.handleError(context, err);
    }
}