const request = require('supertest');
const app = require('../app'); //reference to you app.js file
const responseCode = require('../utils/http-code')
const assert = require('chai').assert;
const expect = require('chai').expect;
const jwt = require('jsonwebtoken')
let email = 'testuser@gmail.com'
let password = 'password123'
let tipe = 1
let token ="";

describe('Basic User Test', function () {
    it('Response should be the registered user', function (done) {
        request(app)
            .post('/register')
            .send({name :'Ricahrd' , email : email, password : password, gender: 1, phone_number : '12345678', tipe: tipe })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_INSERT)
            .expect(response => {
                expect(response.body.message).to.equal('Berhasil melakukan registrasi user','Response message tidak sesuai');
                expect(response.body.data.email).to.equal( email,'Email yang diberikan pada response tidak sesuai')
                expect(response.body.data.tipe).to.equal(tipe,'Tipe yang diberikan pada resposne tidak sesuai')
            })
            .end(done);
    });
    it('User can login', function (done) {
        request(app)
            .post('/login')
            .send({email : email, password: password })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_GET)
            .expect(response => {
                expect(response.body.message).to.equal('Success Login','Response message tidak sesuai');
                var userLogin = jwt.verify(response.body.token, 'soa2018');
                expect(userLogin.email).to.equal(email,'Payload email JWT tidak sesuai')
                token = response.body.token;
            })
            .end(done);;
    });
    console.log('tes');
});