const request = require('supertest');
const app = require('../app'); //reference to you app.js file
const responseCode = require('../utils/http-code')
const assert = require('chai').assert;
const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const fakeData= require('./global');

describe('Testing registration for all user role', function () {
    it(`Register using basic user with email : ${fakeData.user.basic.email}`, function (done) {
        request(app)
            .post('/register')
            .send(fakeData.user.basic)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_INSERT)
            .expect(response => {
                expect(response.body.message).to.equal('Berhasil melakukan registrasi user','Response message tidak sesuai');
                expect(response.body.data.email).to.equal( fakeData.user.basic.email,'Email yang diberikan pada response tidak sesuai')
                expect(response.body.data.tipe).to.equal(fakeData.user.basic.tipe,'Tipe yang diberikan pada resposne tidak sesuai')
            })
            .end(done);
    });
    
    it(`Register using basic pro with email : ${fakeData.user.pro.email}`, function (done) {
        request(app)
            .post('/register')
            .send(fakeData.user.pro)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_INSERT)
            .expect(response => {
                expect(response.body.message).to.equal('Berhasil melakukan registrasi user','Response message tidak sesuai');
                expect(response.body.data.email).to.equal( fakeData.user.pro.email,'Email yang diberikan pada response tidak sesuai')
                expect(response.body.data.tipe).to.equal(fakeData.user.pro.tipe,'Tipe yang diberikan pada resposne tidak sesuai')
            })
            .end(done);
    });
    
    
    it(`Register using admin user with email : ${fakeData.user.admin.email}`, function (done) {
        request(app)
            .post('/register')
            .send(fakeData.user.admin)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_INSERT)
            .expect(response => {
                expect(response.body.message).to.equal('Berhasil melakukan registrasi user','Response message tidak sesuai');
                expect(response.body.data.email).to.equal( fakeData.user.admin.email,'Email yang diberikan pada response tidak sesuai')
                expect(response.body.data.tipe).to.equal(fakeData.user.admin.tipe,'Tipe yang diberikan pada resposne tidak sesuai')
            })
            .end(done);
    });
    

    it('Basic User can login', function (done) {
        request(app)
            .post('/login')
            .send({email : fakeData.user.basic.email, password: fakeData.user.basic.password })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_GET)
            .expect(response => {
                expect(response.body.message).to.equal('Success Login','Response message tidak sesuai');
                var userLogin = jwt.verify(response.body.token, 'soa2018');
                expect(userLogin.email).to.equal(fakeData.user.basic.email,'Payload email JWT tidak sesuai')
                global.tokenBasic = response.body.token;
                global.userBasic = userLogin;
            })
            .end(done);
    });
    
    it('Pro User can login', function (done) {
        request(app)
            .post('/login')
            .send({email : fakeData.user.pro.email, password: fakeData.user.pro.password })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_GET)
            .expect(response => {
                expect(response.body.message).to.equal('Success Login','Response message tidak sesuai');
                var userLogin = jwt.verify(response.body.token, 'soa2018');
                expect(userLogin.email).to.equal(fakeData.user.pro.email,'Payload email JWT tidak sesuai')
                global.tokenPro = response.body.token;
                global.userPro = userLogin;
            })
            .end(done);
    });
    
    it('Admin User can login', function (done) {
        request(app)
            .post('/login')
            .send({email : fakeData.user.admin.email, password: fakeData.user.admin.password })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_GET)
            .expect(response => {
                expect(response.body.message).to.equal('Success Login','Response message tidak sesuai');
                var userLogin = jwt.verify(response.body.token, 'soa2018');
                expect(userLogin.email).to.equal(fakeData.user.admin.email,'Payload email JWT tidak sesuai')
                global.tokenAdmin = response.body.token;
                global.userAdmin = userLogin;
            })
            .end(done);
    });
});