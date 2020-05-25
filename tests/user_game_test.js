const request = require('supertest');
const app = require('../app'); //reference to you app.js file
const responseCode = require('../utils/http-code')
const assert = require('chai').assert;
const expect = require('chai').expect;
const jwt = require('jsonwebtoken')

let id_game;
let tokenBasic;
let idUserBasic;
let idUserPro;
let tokenAdmin;
let idUserAdmin;

describe('Users Reviews Test', function () {
    before(function() {
        id_game =  global.seed_id_game;
        tokenBasic = global.tokenBasic;
        idUserBasic = global.userBasic.id;
        idUserPro = global.userPro.id;
        tokenAdmin = global.tokenAdmin;
        idUserAdmin = global.userAdmin.id;
    });
    it('Basic User can insert user game', function (done) {
        request(app)
            .post(`/user/${idUserBasic}/game`)
            .send({
                id_game: id_game,
                id_user: idUserBasic,
            })
            .set('Accept', 'application/json')
            .set('token', tokenBasic)
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_INSERT)
            .expect(response => {
                expect(response.body.message).to.equal('Successfuly inserted user game', 'Response message tidak sesuai')
                expect(response.body.data.id_game).to.equal(id_game, 'ID Game yang diberikan pada response tidak sesuai')
                expect(response.body.data.id_user).to.equal(idUserBasic, 'ID User yang diberikan pada response tidak sesuai')
            })
            .end(done);
    });
    it('Admin can insert other user game', function (done) {
        request(app)
            .post(`/user/${idUserPro}/game`)
            .send({
                id_game: id_game,
                id_user: idUserPro,
            })
            .set('Accept', 'application/json')
            .set('token', tokenAdmin)
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_INSERT)
            .expect(response => {
                expect(response.body.message).to.equal('Successfuly inserted user game', 'Response message tidak sesuai')
                expect(response.body.data.id_game).to.equal(id_game, 'ID Game yang diberikan pada response tidak sesuai')
                expect(response.body.data.id_user).to.equal(idUserPro, 'ID User yang diberikan pada response tidak sesuai')
            })
            .end(done);
    });
    it('GET all user games should contain inserted', function (done) {
      request(app)
          .get(`/user/${idUserBasic}/game`)
          .set('token', tokenBasic)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(responseCode.OK)
          .expect(response => {
            let data = response.body.data.find((item) => item.id_game == id_game);
            expect(data.id_game).to.equal(id_game,'ID game sesuai')
          })
          .end(done);
    });
    
    it('Basic User can delete game', function (done) {
        request(app)
            .delete(`/user/${idUserBasic}/game/${id_game}`)
            .set('Accept', 'application/json')
            .set('token', tokenBasic)
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
                expect(response.body.message).to.equal('Successfuly deleted user game', 'Response message tidak sesuai')
            })
            .end(done);
    });
    
    it('User game should be deleted', function (done) {
        request(app)
            .get(`/user/${idUserBasic}/game`)
            .set('token', tokenAdmin)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
              let data = response.body.data.find((item) => item.id_game == id_game);
              expect(data).to.equal(undefined,'Data masih terdapat pada database')
            })
            .end(done);
      });
      
    it('Admin can delete other user game', function (done) {
        request(app)
            .delete(`/user/${idUserPro}/game/${id_game}`)
            .set('Accept', 'application/json')
            .set('token', tokenAdmin)
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
                expect(response.body.message).to.equal('Successfuly deleted user game', 'Response message tidak sesuai')
            })
            .end(done);
    });
    
    it('User game should be deleted', function (done) {
        request(app)
            .get(`/user/${idUserPro}/game`)
            .set('token', tokenBasic)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
              let data = response.body.data.find((item) => item.id_game == id_game);
              expect(data).to.equal(undefined,'Data masih terdapat pada database')
            })
            .end(done);
      });
});