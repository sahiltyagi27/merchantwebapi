'use strict';

const request = require('request-promise');
const expect = require('chai').expect;
const uuid = require('uuid');
const merchantID = '12358cfa-063d-4f5c-be5d-b90cfb64d1d6';
const sampleAccessLog = { ...require('../spec/sample-docs/AccessLog'), _id: uuid.v4() };
sampleAccessLog.partitionKey = sampleAccessLog._id;
sampleAccessLog.posMerchantID = merchantID;

describe('Read AccessLog', () => {
    it('should throw error on incorrect id field', async () => {
        try {
            await request.get(`http://localhost:7071/api/read-access-log/merchants/123/filters/'filter'/value/'filterValue'`, {
                json: true,
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
                json: true
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