const errors = require('../errors');
const utils = require('../utils');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";


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

        MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function (err, db) {
            console.log('db connected');
            try {
                if (err) throw err;
            }
            catch (err) {

            }

            var dbo = db.db("mydb");
            //console.log(req.query.filter);
            //console.log(req.query.filterValue);

            switch (req.query.filter) {
                case "posMerchantID": findPosDocuments(dbo, req.query.filterValue, lastFunction);

                    break;
                case "tokenMerchantID": findTokenDocuments(dbo, req.query.filterValue, lastFunction);

                    break;

                case "siteID": findSiteDocuments(dbo, req.query.filterValue, lastFunction);

                    break;
                case "zoneID": findZoneDocuments(dbo, req.query.filterValue, lastFunction);

                    break;
                case "pointofServiceID": findServiceDocuments(dbo, req.query.filterValue, lastFunction);

                    break;
                case "accessTokenID": findAccessTokenDocuments(dbo, req.query.filterValue, lastFunction);

                    break;
                case "walletID": findWalletDocuments(dbo, req.query.filterValue, lastFunction);

                    break;
                case "accessTokenType": findAccessTokenTypeDocuments(dbo, req.query.filterValue, lastFunction);

                    break;
                case "accessRoleCode": findAccessRoleCodeDocuments(dbo, req.query.accessRoleCode, lastFunction);

                    break;
                case "eventCode": findEventCodeDocuments(dbo, req.query.filterValue, lastFunction);

                    break;
                case "statusCode": findstatusCodeDocuments(dbo, req.query.filterValue, lastFunction);

                    break;


                default: findDocuments(dbo, lastFunction);
                    break;
            }

        });
    } catch (err) {
        utils.handleError(context, err);
    }
}

const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('accesslogs');
    // Find some documents
    collection.find({}).sort({ "createdDate": -1 }).limit(200).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findPosDocuments = function (db, id, callback) {
    // Get the documents collection
    const collection = db.collection('accesslogs');
    // Find some documents
    collection.find({ posMerchantID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findTokenDocuments = function (db, id, callback) {
    // Get the documents collection
    const collection = db.collection('accesslogs');
    // Find some documents
    console.log('func running')
    collection.find({ tokenMerchantID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findSiteDocuments = function (db, id, callback) {
    // Get the documents collection
    const collection = db.collection('accesslogs');
    // Find some documents
    collection.find({ siteID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findZoneDocuments = function (db, id, callback) {
    // Get the documents collection
    const collection = db.collection('accesslogs');
    // Find some documents
    collection.find({ zoneID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findServiceDocuments = function (db, id, callback) {
    // Get the documents collection
    const collection = db.collection('accesslogs');
    // Find some documents
    collection.find({ pointOfServiceID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findAccessTokenDocuments = function (db, id, callback) {
    // Get the documents collection
    const collection = db.collection('accesslogs');
    // Find some documents
    collection.find({ accessTokenID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findWalletDocuments = function (db, id, callback) {
    // Get the documents collection
    const collection = db.collection('accesslogs');
    // Find some documents
    collection.find({ walletID: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findAccessTokenTypeDocuments = function (db, id, callback) {
    // Get the documents collection
    const collection = db.collection('accesslogs');
    // Find some documents
    collection.find({ accessTokenType: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findAccessRoleCodeDocuments = function (db, id, callback) {
    // Get the documents collection
    const collection = db.collection('accesslogs');
    // Find some documents
    collection.find({ accessRoleCode: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findEventCodeDocuments = function (db, id, callback) {
    // Get the documents collection
    const collection = db.collection('accesslogs');
    // Find some documents
    collection.find({ eventCode: { $eq: id } }).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findstatusCodeDocuments = function (db, id, callback) {
    // Get the documents collection
    const collection = db.collection('accesslogs');
    // Find some documents
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