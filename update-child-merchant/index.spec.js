'use strict'
const request = require('request-promise');
const expect = require('chai').expect;
const uuid = require('uuid');
const parentMerchantID = uuid.v4();
const crypto = require('crypto');
const randomString = crypto.randomBytes(3).toString('hex');
const email = `test.${randomString}@testmail.com`;
const sampleUser = { ...require('../spec/sample-docs/Users'), _id: uuid.v4(), email }
sampleUser.merchants[0].merchantID = parentMerchantID;
let authToken
const childID = uuid.v4();
const data = {champ:"Ronaldo" }
describe('Update child merchant', async () => {
    before(async () => {
        sampleUser.merchants[0].merchantID = parentMerchantID;

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
    it('It should throw error on incorrect parentMerchantID field', async () => {
        try {
            await request.put(`http://localhost:7071/api/update-child-merchant/123/child/${childID}`, {
                json: true,
                body: data,
                headers: {
                    'authorization': authToken
                }
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
                body: data,
                headers: {
                    'authorization': authToken
                }
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
                headers: {
                    'authorization': authToken
                }
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
    after(async () => {
        await request.delete(`http://localhost:7071/api/delete-user/${sampleUser._id}`, {
            json: true,
            headers: {
                'authorization': authToken
            }
        });

    });
});