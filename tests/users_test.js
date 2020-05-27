const request = require('supertest');
const app = require('../app'); //reference to you app.js file
const responseCode = require('../utils/http-code')
const assert = require('chai').assert;
const expect = require('chai').expect;
const jwt = require('jsonwebtoken')

let tokenBasic;
let idUserBasic;
let idUserPro;
let tokenAdmin;
let idUserAdmin;
let editedName;
let editedGender;

describe('Users Reviews Test', function () {
    before(function() {
        tokenBasic = global.tokenBasic;
        idUserBasic = global.userBasic.id;
        idUserPro = global.userPro.id;
        tokenPro = global.tokenPro;
        tokenAdmin = global.tokenAdmin;
        idUserAdmin = global.userAdmin.id;
        editedName=   "testing-edit-name";
        editedGender= 0;
    });
    it('/users should return inserted user', function (done) {
        request(app)
            .get('/users')
            .set('Accept', 'application/json')
            .set('token', tokenBasic)
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
                let data = response.body.data.find((item) => item.id == idUserBasic);
                expect(data.id).to.equal(idUserBasic,'Tidak terdapat user seeding pada get user')
            })
            .end(done);
    });
    it('/user/:id_user should return get user', function (done) {
        request(app)
            .get(`/users/${idUserBasic}`)
            .set('Accept', 'application/json')
            .set('token', tokenBasic)
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
                expect(response.body.data.name).to.equal(global.userBasic.name,'Tidak terdapat user seeding pada get user')
            })
            .end(done);
    });
    it('PATCH /user/:id_user Other user cannot edit other user data', function (done) {
        request(app)
            .patch(`/users/${idUserBasic}`)
            .set('Accept', 'application/json')
            .set('token', tokenPro)
            .expect('Content-Type', /json/)
            .expect(responseCode.FORBIDDEN)
            .end(done);
    });
    it('PATCH /user/:id_user Other user cannot edit other user data', function (done) {
        request(app)
            .patch(`/users/${idUserBasic}`)
            .send({
                "name" : editedName,
                "gender" : editedGender
            })
            .set('Accept', 'application/json')
            .set('token', tokenBasic)
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
                expect(response.body.message).to.equal('User berhasil diupdate','Response message tidak sesuai')
            })
            .end(done);
    });
    
    it('GET /user/:id_user edited user data should change', function (done) {
        request(app)
            .get(`/users/${idUserBasic}`)
            .set('Accept', 'application/json')
            .set('token', tokenBasic)
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
                expect(response.body.data.name).to.equal(editedName,'Tidak terdapat user seeding pada get user')
            })
            .end(done);
    });
    
    it('DELETE /user/:id_user Normal user cannot delete', function (done) {
        request(app)
            .delete(`/users/${idUserBasic}`)
            .set('Accept', 'application/json')
            .set('token', tokenBasic)
            .expect('Content-Type', /json/)
            .expect(responseCode.FORBIDDEN)
            .end(done);
    });
    it('DELETE /user/:id_user Admin delete basic user', function (done) {
        request(app)
            .delete(`/users/${idUserBasic}`)
            .set('Accept', 'application/json')
            .set('token', tokenAdmin)
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .end(done);
    });
    it('/user/:id_user deleted user should return 404', function (done) {
        request(app)
            .get(`/users/${idUserBasic}`)
            .set('Accept', 'application/json')
            .set('token', tokenAdmin)
            .expect('Content-Type', /json/)
            .expect(responseCode.NOT_FOUND)
            .end(done);
    });
    
    it('DELETE /user/:id_user Admin delete pro user', function (done) {
        request(app)
            .delete(`/users/${idUserPro}`)
            .set('Accept', 'application/json')
            .set('token', tokenAdmin)
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .end(done);
    });
    it('DELETE /user/:id_user Admin delete admin user', function (done) {
        request(app)
            .delete(`/users/${idUserAdmin}`)
            .set('Accept', 'application/json')
            .set('token', tokenAdmin)
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .end(done);
    });
});