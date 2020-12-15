const errors = require('../errors');
const utils = require('../utils');
const { database } = require('../db/mongodb');

module.exports = async function (context, req) {

    try {
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
            case "posMerchantID": findPosDocuments(collection, req.query.filterValue, lastFunction);

                break;
            case "tokenMerchantID": findTokenDocuments(collection, req.query.filterValue, lastFunction);

                break;

            case "siteID": findSiteDocuments(collection, req.query.filterValue, lastFunction);

                break;
            case "zoneID": findZoneDocuments(collection, req.query.filterValue, lastFunction);

                break;
            case "pointofServiceID": findServiceDocuments(collection, req.query.filterValue, lastFunction);

                break;
            case "accessTokenID": findAccessTokenDocuments(collection, req.query.filterValue, lastFunction);

                break;
            case "walletID": findWalletDocuments(collection, req.query.filterValue, lastFunction);

                break;
            case "accessTokenType": findAccessTokenTypeDocuments(collection, req.query.filterValue, lastFunction);

                break;
            case "accessRoleCode": findAccessRoleCodeDocuments(collection, req.query.accessRoleCode, lastFunction);

                break;
            case "eventCode": findEventCodeDocuments(collection, req.query.filterValue, lastFunction);

                break;
            case "statusCode": findstatusCodeDocuments(collection, req.query.filterValue, lastFunction);

                break;


            default: findDocuments(collection, lastFunction);
                break;
        }
    } catch (err) {
        utils.handleError(context, err);
    }
}

const findDocuments = function (collection, callback) {
    collection.find({}).sort({ "createdDate": -1 }).limit(200).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findPosDocuments = function (collection, id, callback) {
    collection.find({ posMerchantID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findTokenDocuments = function (collection, id, callback) {
    console.log('func running')
    collection.find({ tokenMerchantID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findSiteDocuments = function (collection, id, callback) {
    collection.find({ siteID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findZoneDocuments = function (collection, id, callback) {
    collection.find({ zoneID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findServiceDocuments = function (collection, id, callback) {
    collection.find({ pointOfServiceID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findAccessTokenDocuments = function (collection, id, callback) {
    collection.find({ accessTokenID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findWalletDocuments = function (collection, id, callback) {
    collection.find({ walletID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findAccessTokenTypeDocuments = function (collection, id, callback) {
    collection.find({ accessTokenType: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findAccessRoleCodeDocuments = function (collection, id, callback) {
    collection.find({ accessRoleCode: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findEventCodeDocuments = function (collection, id, callback) {
    collection.find({ eventCode: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findstatusCodeDocuments = function (collection, id, callback) {
    collection.find({ statusCode: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const lastFunction = () => {
    console.log('closing connection')
    db.close();
}