'use strict'

const expect = require('chai').expect;
//const helpers = require('../spec/helpers');
const request = require('request-promise');
const uuid = require('uuid');
const crypto = require('crypto');
const merchantID = '12358cfa-063d-4f5c-be5d-b90cfb64d1d6';
const randomString = crypto.randomBytes(3).toString('hex');
const email = `test.${randomString}@testmail.com`;
const sampleUser = { ...require('../spec/sample-docs/Users'), _id: uuid.v4(), email }
const sampleAccessLog = { ...require('../spec/sample-docs/AccessLog'), _id: uuid.v4() }
sampleAccessLog.partitionKey = sampleAccessLog._id;
sampleAccessLog.posMerchantID = merchantID;
sampleAccessLog.tokenMerchantID = merchantID;
sampleUser.merchants[0].merchantID = merchantID;

describe('Create accesslog', async () => {

    it('should throw error if request body is empty', async () => {
        try {
            await request.post(`http://localhost:7071/api/create-access-log`, {
                json: true
            })
        } catch (error) {
            const response = {
                code: 400,
                description: 'You\'ve requested to create a new access-log but the request body seems to be empty. Kindly pass the access-log to be created using request body in application/json format',
                reasonPhrase: 'EmptyRequestBodyError'
            };
            expect(error.statusCode).to.equal(400)
            expect(error.error).to.eql(response)
        }
    });

    it('should create doc when all validation pass', async () => {

        const result = await request.post(`http://localhost:7071/api/create-access-log`, {
            body: sampleAccessLog,
            json: true,
        });
        expect(result).not.to.be.null;
        expect(result._id).to.be.equal(sampleAccessLog._id);
    });
    it('should not create doc when doc already exist', async () => {

        try {
            await request.post(`http://localhost:7071/api/create-access-log`, {
                body: sampleAccessLog,
                json: true,
            });
        } catch (error) {
            const response = {
                code: 409,
                description: 'You\'ve requested to create a new accessLog but a accessLog with the specified _id field already exists.',
                reasonPhrase: 'DuplicateAccessLogError'
            };
            expect(error.statusCode).to.equal(409);
            expect(error.error).to.eql(response);
        }
    });

    it('should return error when req body don\'t have merchantID', async () => {
        sampleAccessLog._id = uuid.v4();
        sampleAccessLog.partitionKey = sampleAccessLog._id;
        delete sampleAccessLog.posMerchantID;
        delete sampleAccessLog.tokenMerchantID;
        try {
            await request.post(`http://localhost:7071/api/create-access-log`, {
                body: sampleAccessLog,
                json: true,
            });
        } catch (error) {
            const response = {
                code: 401,
                description: 'Please send MerchantID in req body.',
                reasonPhrase: 'FieldValidationError'
            };
            expect(error.statusCode).to.equal(401);
            expect(error.error).to.eql(response);
        }
    });
});