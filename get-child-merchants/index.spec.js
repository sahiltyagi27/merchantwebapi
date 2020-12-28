'use strict'

const request = require('request-promise');
const expect = require('chai').expect;
const uuid = require('uuid');
//const merchantID = '2cc58cfa-063d-4f5c-be5d-b90cfb64d1d6';
const parentMerchantID = '2cc58cfa-063d-4f5c-be5d-b90cfb64d1d6';


describe('Get child merchants', async () => {
    it('It should throw error on incorrect id field', async () => {
        try {
            await request.get('http://localhost:7071/api/get-child-merchants/123', {
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
    it('should throw error on data not exist', async () => {
        try {
            await request.get(`http://localhost:7071/api/get-child-merchants/${parentMerchantID}`, {
                json: true
                // body: {
                //     userMerchants: [merchantID]
                // }
            });
        } catch (error) {
            const response = {
                code: 404,
                description: 'The child merchants of specified details doesn\'t exist.',
                reasonPhrase: 'ChildMerchantsNotFoundError'
            };

            expect(error.statusCode).to.equal(404);
            expect(error.error).to.eql(response);
        }
    });
});