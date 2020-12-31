'use strict';

const request = require('request-promise');
const expect = require('chai').expect;
const uuid = require('uuid');
const crypto = require('crypto');
const merchantID = uuid.v4();
const randomString = crypto.randomBytes(3).toString('hex');
const email = `test.${randomString}@testmail.com`;
const sampleUser = { ...require('../spec/sample-docs/Users'), _id: uuid.v4(), email }
const sampleAccessLog = { ...require('../spec/sample-docs/AccessLog'), _id: uuid.v4() };
sampleAccessLog.partitionKey = sampleAccessLog._id;
sampleAccessLog.posMerchantID = merchantID;
let authToken
describe('Read AccessLog', () => {
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
    it('should throw error on incorrect id field', async () => {
        try {
            await request.get(`http://localhost:7071/api/read-access-log/merchants/123/filters/'filter'/value/'filterValue'`, {
                json: true,
                headers: {
                    'authorization': authToken
                }
            });
        } catch (error) {
            const response = {
                code: 400,
                description: 'The MerchantID specified in the URL does not match the UUID v4 format.',
                reasonPhrase: 'InvalidUUIDError'
            }
            expect(error.statusCode).to.equal(400);
            expect(error.error).to.eql(response);
        }
    });
    it('should throw error on data not exist', async () => {
        try {
            await request.get(`http://localhost:7071/api/read-access-log/merchants/${merchantID}/filters/'filter'/value/'filterValue'`, {
                json: true,
                headers: {
                    'authorization': authToken
                }
            });
        } catch (error) {
            const response = {
                code: 404,
                description: 'The accessLog of specified details doesn\'t exist.',
                reasonPhrase: 'AccessLogNotFoundError'
            };

            expect(error.statusCode).to.equal(404);
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