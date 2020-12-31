'use strict'

const expect = require('chai').expect;
//const helpers = require('../spec/helpers');
const request = require('request-promise');
const uuid = require('uuid');
const crypto = require('crypto');
const merchantID = uuid.v4();
const randomString = crypto.randomBytes(3).toString('hex');
const email = `test.${randomString}@testmail.com`;
const sampleUser = { ...require('../spec/sample-docs/Users'), _id: uuid.v4(), email }
const sampleAccessLog = { ...require('../spec/sample-docs/AccessLog'), _id: uuid.v4() }
sampleAccessLog.partitionKey = sampleAccessLog._id;
sampleAccessLog.posMerchantID = merchantID;
sampleAccessLog.tokenMerchantID = merchantID;
sampleUser.merchants[0].merchantID = merchantID;
let authToken
describe('Create accesslog', async () => {
    before(async () => {
        sampleAccessLog.posMerchantID = merchantID;
        sampleUser.merchants[0].merchantID = merchantID;

        await request.post('http://localhost:7071/api/signup', {
            body: sampleUser,
            json: true,
            headers: {
                'x-functions-key': process.env.USER_API_KEY
            }
        });

        const token = await request.post('http://localhost:7071/api/login-user', {
            body: {
                email: sampleUser.email,
                password: sampleUser.password
            },
            json: true,
            headers: {
                'x-functions-key': process.env.USER_API_KEY
            }
        });
        authToken = token.accesstoken;
    });
    it('should throw error if request body is empty', async () => {
        try {
            await request.post(`http://localhost:7071/api/create-access-log`, {
                json: true,
                headers: {
                    'authorization': authToken
                }
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
            headers: {
                'authorization': authToken
            }
        });
        expect(result).not.to.be.null;
        expect(result._id).to.be.equal(sampleAccessLog._id);
    });
    it('should not create doc when doc already exist', async () => {

        try {
            await request.post(`http://localhost:7071/api/create-access-log`, {
                body: sampleAccessLog,
                json: true,
                headers: {
                    'authorization': authToken
                }
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
                headers: {
                    'authorization': authToken
                }
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
    after(async () => {
        await request.delete(`http://localhost:7071/api/delete-user/${sampleUser._id}`, {
            json: true,
            headers: {
                'authorization': authToken
            }
        });

    });
});