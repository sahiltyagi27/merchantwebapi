'use strict'

const expect = require('chai').expect;
const request = require('request-promise');
const uuid = require('uuid');
const crypto = require('crypto');
const randomString = crypto.randomBytes(3).toString('hex');
const email = `test.${randomString}@testmail.com`;
const sampleUser = { ...require('../spec/sample-docs/Users'), _id: uuid.v4(), email }
let authToken
describe('Get User', () => {
    before(async () => {

        await request.post(`http://localhost:7071/api/signup`, {
            json: true,
            body: sampleUser
        })

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

    it('It should throw error when userID is invalid', async () => {
        try {
            await request.get(`http://localhost:7071/api/users/1234`, {
                json: true,
                headers: {
                    authorization: authToken
                }
            })
        } catch (error) {
            const response = {
                code: 400,
                description: 'The userID specified in the URL does not match the UUID v4 format.',
                reasonPhrase: 'InvalidUUIDError'
            };
            expect(error.statusCode).to.equal(400);
            expect(error.error).to.eql(response);
        }
    })

    it('Should get user when all test cases pass', async () => {
        const result = await request.get(`http://localhost:7071/api/users/${sampleUser._id}`, {
            json: true,
            headers: {
                authorization: authToken
            }
        })
        expect(result).not.to.be.null;
        expect(result._id).to.be.equal(sampleUser._id);
    });

    after(async () => {
        await request.delete(`http://localhost:7071/api/delete-user/${sampleUser._id}`, {
            json: true,
            headers: {
                authorization: authToken
            }
        })
    });
});