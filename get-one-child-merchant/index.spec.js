'use strict'

const request = require('request-promise');
const expect = require('chai').expect;
const uuid = require('uuid');
const childID = '2cc58cfa-063d-4f5c-be5d-b90cfb64d1d6';
const parentMerchantID = '2cc58cfa-063d-4f5c-be5d-b90cfb64d1d6';

describe('Get one child merchant', async () => {
    it('It should throw error on incorrect parentMerchantID field', async () => {
        try {
            await request.get(`http://localhost:7071/api/get-one-child-merchant/123/child/${childID}`, {
                json: true
            });
        } catch (error) {
            const response = {
                code: 400,
                description: 'The parentMerchantID specified in the URL does not match the UUID v4 format.',
                reasonPhrase: 'InvalidUUIDError'
            };
            expect(error.statusCode).to.equal(400);
            expect(error.error).to.eql(response);
        }
    });
    it('It should throw error on incorrect childID field', async () => {
        try {
            await request.get(`http://localhost:7071/api/get-one-child-merchant/${parentMerchantID}/child/123`, {
                json: true
            });
        } catch (error) {
            const response = {
                code: 400,
                description: 'The childID specified in the URL does not match the UUID v4 format.',
                reasonPhrase: 'InvalidUUIDError'
            };
            expect(error.statusCode).to.equal(400);
            expect(error.error).to.eql(response);
        }
    });
    
    it('should throw error on data not exist', async () => {
        try {
            await request.get(`http://localhost:7071/api/get-one-child-merchant/${parentMerchantID}/child/${childID}`, {
                json: true
                // body: {
                //     userMerchants: [merchantID]
                // }
            });
        } catch (error) {
            const response = {
                code: 404,
                description: 'The merchant of specified details doesn\'t exist.',
                reasonPhrase: 'MerchantNotFoundError'
            };

            expect(error.statusCode).to.equal(404);
            expect(error.error).to.eql(response);
        }
    });
});