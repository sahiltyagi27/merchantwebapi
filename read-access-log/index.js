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

        switch (req.query.filter) {
            case "posMerchantID": findPosDocuments(collection, req.query.filterValue);

                break;
            case "tokenMerchantID": findTokenDocuments(collection, req.query.filterValue);

                break;

            case "siteID": findSiteDocuments(collection, req.query.filterValue);

                break;
            case "zoneID": findZoneDocuments(collection, req.query.filterValue);

                break;
            case "pointofServiceID": findServiceDocuments(collection, req.query.filterValue);

                break;
            case "accessTokenID": findAccessTokenDocuments(collection, req.query.filterValue);

                break;
            case "walletID": findWalletDocuments(collection, req.query.filterValue);

                break;
            case "accessTokenType": findAccessTokenTypeDocuments(collection, req.query.filterValue);

                break;
            case "accessRoleCode": findAccessRoleCodeDocuments(collection, req.query.accessRoleCode);

                break;
            case "eventCode": findEventCodeDocuments(collection, req.query.filterValue);

                break;
            case "statusCode": findstatusCodeDocuments(collection, req.query.filterValue);

                break;


            default: findDocuments(collection);
                break;
        }
    } catch (err) {
        utils.handleError(context, err);
    }
}

const findDocuments = function (collection) {
    collection.find({}).sort({ "createdDate": -1 }).limit(200).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
    });
}

const findPosDocuments = function (collection, id) {
    collection.find({ posMerchantID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
    });
}

const findTokenDocuments = function (collection, id) {
    console.log('func running')
    collection.find({ tokenMerchantID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
    });
}

const findSiteDocuments = function (collection, id) {
    collection.find({ siteID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
    });
}

const findZoneDocuments = function (collection, id) {
    collection.find({ zoneID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
    });
}

const findServiceDocuments = function (collection, id) {
    collection.find({ pointOfServiceID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
    });
}

const findAccessTokenDocuments = function (collection, id) {
    collection.find({ accessTokenID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
    });
}

const findWalletDocuments = function (collection, id) {
    collection.find({ walletID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
    });
}

const findAccessTokenTypeDocuments = function (collection, id) {
    collection.find({ accessTokenType: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
    });
}

const findAccessRoleCodeDocuments = function (collection, id) {
    collection.find({ accessRoleCode: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
    });
}

const findEventCodeDocuments = function (collection, id) {
    collection.find({ eventCode: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
    });
}

const findstatusCodeDocuments = function (collection, id) {
    collection.find({ statusCode: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
    });
}