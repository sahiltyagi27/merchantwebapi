'use strict';

const request = require('request-promise');
//const helpers = require('../spec/helpers');
const expect = require('chai').expect;
const uuid = require('uuid');
const crypto = require('crypto');
const merchantID = '12358cfa-063d-4f5c-be5d-b90cfb64d1d6';
const randomString = crypto.randomBytes(3).toString('hex');
const email = `test.${randomString}@testmail.com`;
const sampleUser = { ...require('../spec/sample-docs/Users'), _id: uuid.v4(), email };
const sampleAccessLog = { ...require('../spec/sample-docs/AccessLog'), _id: uuid.v4() };
sampleAccessLog.partitionKey = sampleAccessLog._id;
sampleAccessLog.posMerchantID = merchantID;
sampleUser.merchants[0].merchantID = merchantID;

describe('Get AccessLog', () => {
    it('should throw error on incorrect id field', async () => {
        try {
            await request.get(`http://localhost:7071/api/get-access-log/merchants/${merchantID}/access-log/123`, {
                json: true,
            });
        } catch (error) {
            const response = {
                code: 400,
                description: 'The accessLogID specified in the URL does not match the UUID v4 format.',
                reasonPhrase: 'InvalidUUIDError'
            }
            expect(error.statusCode).to.equal(400);
            expect(error.error).to.eql(response);
        }
    });
    it('should throw error on data not exist', async () => {
        try {
            await request.get(`http://localhost:7071/api/get-access-log/merchants/${merchantID}/access-log/${uuid.v4()}`, {
                json: true,
                body: {
                    userMerchants: [merchantID]
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
});