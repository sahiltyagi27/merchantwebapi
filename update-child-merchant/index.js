const errors = require('../errors');
const utils = require('../utils');
const { database } = require('../db/mongodb');

module.exports = async function (context, req) {
    try {
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

        const collection = database.collection('merchants');
        collection.updateOne({ parentMerchantID: req.query.parentMerchantID, _id: req.query.childID }, { $set: req.body });
        console.log('Modified the record')

    } catch (err) {
        utils.handleError(context, err);
    }

}