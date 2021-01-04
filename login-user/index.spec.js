'use strict'

const expect = require('chai').expect;
const request = require('request-promise');
const uuid = require('uuid');
const crypto = require('crypto');
const randomString = crypto.randomBytes(3).toString('hex');
const email = `test.${randomString}@testmail.com`;
const sampleUser = { ...require('../spec/sample-docs/Users'), _id: uuid.v4(), email }


describe('Login user', () => {

    before(async () => {
        await request.post(`http://localhost:7071/api/signup`, {
            json: true,
            body: sampleUser
        })
    });

    it('It should throw error when req.body is empty', async () => {
        try {
            await request.post(`http://localhost:7071/api/login-user`, {
                json: true,
            });
        } catch (error) {
            const response = {
                code: 400,
                description: 'You have requested to authenticate a user but the request body seems to be empty. Kindly pass the user to be authenticated using request body in application/json format',
                reasonPhrase: 'EmptyRequestBodyError'
            }
            expect(error.statusCode).to.equal(400)
            expect(error.error).to.eql(response);
        }
    });

    it('It should login when all test cases pass', async () => {

        const result = await request.post(`http://localhost:7071/api/login-user`, {
            json: true,
            body: sampleUser
        });
        expect(result).not.to.be.null;
    });

    after(async () => {
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
        let authToken = token.accesstoken;
        await request.delete(`http://localhost:7071/api/delete-user/${sampleUser._id}`, {
            json: true,
            headers: {
                authorization: authToken
            }
        })
    });
});