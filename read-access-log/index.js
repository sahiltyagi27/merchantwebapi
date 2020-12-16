const errors = require('../errors');
const utils = require('../utils');
const { database } = require('../db/mongodb');

module.exports = async function (context, req) {

    try {

        /*   if (!utils.authenticateRequest(req, res, next)) {
               errors.UserNotAuthenticatedError(req, res, next);
           }*/
        const user = {

            merchants: [
                { merchantID: '12358cfa-063d-4f5c-be5d-b90cfb64d1d6' },
                { merchantID: '12358cfa-063d-4f5c-be5d-b90cfb64d1d7' },
                { merchantID: '12358cfa-063d-4f5c-be5d-b90cfb64d1d8' }
            ],

        };

        let isValidMerchant = false;
        for (var i = 0, len = user.merchants.length; i < len; i++) {
            if (user.merchants[i].merchantID === req.query.merchantID) {   //Validate whether user is allowed to see merchant data or not?
                isValidMerchant = true;
            }
        }
        if (!isValidMerchant) {
            utils.setContextResError(
                context,
                new errors.UserNotAuthenticatedError(
                    'MerchantID not linked to user',
                    401
                )
            );
            return Promise.resolve();
        }
        const collection = database.collection('accesslogs');
        let docs

        if (req.query.filter == 'posMerchantID') {
            docs = await collection.find({ posMerchantID: { $eq: req.query.filterValue } }).toArray()
        } else if (req.query.filter == 'tokenMerchantID') {
            docs = await collection.find({ tokenMerchantID: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'findSiteDocuments') {
            docs = await collection.find({ siteID: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'zoneID') {
            docs = await collection.find({ zoneID: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'pointofServiceID') {
            docs = await collection.find({ pointOfServiceID: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'accessTokenID') {
            docs = await collection.find({ accessTokenID: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'walletID') {
            docs = await collection.find({ walletID: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'accessTokenType') {
            docs = await collection.find({ accessTokenType: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'accessRoleCode') {
            docs = await collection.find({ accessRoleCode: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'eventCode') {
            docs = await collection.find({ eventCode: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'statusCode') {
            docs = collection.find({ statusCode: { $eq: req.query.filterValue } }).toArray();
        } else {
            docs = await collection.find({}).sort({ "createdDate": -1 }).limit(200).toArray()
        }

        context.res = {
            body: docs
        }
        return Promise.resolve()
    } catch (err) {
        utils.handleError(context, err);
    }
}