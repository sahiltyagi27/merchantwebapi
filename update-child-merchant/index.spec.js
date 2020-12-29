'use strict'
const request = require('request-promise');
const expect = require('chai').expect;
const childID = '2cc58cfa-063d-4f5c-be5d-b90cfb64d1d6';
const parentMerchantID = '2cc58cfa-063d-4f5c-be5d-b90cfb64d1d6';
const data = {champ:"Ronaldo" }
describe('Update child merchant', async () => {
    it('It should throw error on incorrect parentMerchantID field', async () => {
        try {
            await request.put(`http://localhost:7071/api/update-child-merchant/123/child/${childID}`, {
                json: true,
                body: data
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
            await request.put(`http://localhost:7071/api/update-child-merchant/${parentMerchantID}/child/123`, {
                json: true,
                body: data
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

    it('should throw error on empty request body', async () => {
        try {
            await request.put(`http://localhost:7071/api/update-child-merchant/${parentMerchantID}/child/${childID}`, {
                json: true,
            });
        } catch (error) {
            const response = {
                code: 400,
                description: 'You\'ve requested to update a child merchant but the request body seems to be empty. Kindly pass the child merchant to be updated using request body in application/json format',
                reasonPhrase: 'EmptyRequestBodyError'
            };

            expect(error.statusCode).to.equal(400);
            expect(error.error).to.eql(response);
        }
    });

});