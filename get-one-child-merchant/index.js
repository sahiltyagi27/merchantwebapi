const errors = require('../errors');
const utils = require('../utils');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';


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

        MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function (err, db) {
            console.log('db connected');
            var dbo = db.db("mydb");

            try {
                if (err) throw err;
            }
            catch (err) {

            }
            const collection = dbo.collection('merchants');
            collection.findOne({ parentMerchantID: { $eq: req.query.parentMerchantID }, _id: {$eq: req.query.childID} },function (err, docs) {
                console.log("Found the following records");
                console.log(docs)
                dbo.close();
            });

        });

    } catch (err) {
        utils.handleError(context, err);
    }

}