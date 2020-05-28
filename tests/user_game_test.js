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

describe('Users Games Test', function () {
    before(function() {
        id_game =  global.seed_id_game;
        tokenBasic = global.tokenBasic;
        idUserBasic = global.userBasic.id;
        idUserPro = global.userPro.id;
        tokenAdmin = global.tokenAdmin;
        idUserAdmin = global.userAdmin.id;
    });
    it('Cannot insert completed time if game not completed', function (done) {
        request(app)
            .post(`/users/${idUserBasic}/game`)
            .send({
                id_game: id_game,
                id_user: idUserBasic,
                tipe : 1,
                completed_time :"1"
            })
            .set('Accept', 'application/json')
            .set('token', tokenBasic)
            .expect('Content-Type', /json/)
            .expect(responseCode.BAD_REQUEST)
            .end(done);
    });
    it('Basic User can insert user game', function (done) {
        request(app)
            .post(`/users/${idUserBasic}/game`)
            .send({
                id_game: id_game,
                tipe : 2,
                completed_time :"1"
            })
            .set('Accept', 'application/json')
            .set('token', tokenBasic)
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_INSERT)
            .expect(response => {
                expect(response.body.message).to.equal('Successfuly inserted user game', 'Response message tidak sesuai')
                expect(response.body.data.id_game).to.equal(id_game, 'ID Game yang diberikan pada response tidak sesuai')
                expect(response.body.data.id_user).to.equal(idUserBasic, 'ID User yang diberikan pada response tidak sesuai')
                expect(response.body.data.complete_time).to.equal("00:00:01","Completed Time tidak sesuai")
                expect(response.body.data.tipe).to.equal(2,"Tipe tidak sesuai")
            })
            .end(done);
    });
    it('Admin can insert other user game', function (done) {
        request(app)
            .post(`/users/${idUserPro}/game`)
            .send({
                id_game: id_game,
                tipe : 2,
                completed_time :"1"
            })
            .set('Accept', 'application/json')
            .set('token', tokenAdmin)
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_INSERT)
            .expect(response => {
                expect(response.body.message).to.equal('Successfuly inserted user game', 'Response message tidak sesuai')
                expect(response.body.data.id_game).to.equal(id_game, 'ID Game yang diberikan pada response tidak sesuai')
                expect(response.body.data.id_user).to.equal(idUserPro, 'ID User yang diberikan pada response tidak sesuai')
                expect(response.body.data.complete_time).to.equal("00:00:01","Completed Time tidak sesuai")
                expect(response.body.data.tipe).to.equal(2,"Tipe tidak sesuai")
            })
            .end(done);
    });
    it('GET all user games should contain inserted', function (done) {
      request(app)
          .get(`/users/${idUserBasic}/game`)
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
    
    it('Basic User can edit user game', function (done) {
        request(app)
            .patch(`/users/${idUserBasic}/game/${id_game}`)
            .send({
                tipe : 3,
                completed_time :"12:12:12"
            })
            .set('Accept', 'application/json')
            .set('token', tokenBasic)
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .end(done);
    });
    it('GET all user games data should be updated', function (done) {
      request(app)
          .get(`/users/${idUserBasic}/game`)
          .set('token', tokenBasic)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(responseCode.OK)
          .expect(response => {
            let data = response.body.data.find((item) => item.id_game == id_game);
            expect(data.id_game).to.equal(id_game,'ID game sesuai')
            expect(data.tipe).to.equal(3,'Tipe tidak sesuai dengan yang diupdate')
            expect(data.complete_time).to.equal("12:12:12",'Complete time tidak sesuai dengan yang di update')
          })
          .end(done);
    });
    
    it('GET all user games by game_id data should be updated', function (done) {
        request(app)
            .get(`/users/game/${id_game}`)
            .set('token', tokenBasic)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
              let data = response.body.data.find((item) => item.id_user == idUserBasic);
              expect(data.id_game).to.equal(id_game,'ID game sesuai')
              expect(data.tipe).to.equal(3,'Tipe tidak sesuai dengan yang diupdate')
              expect(data.complete_time).to.equal("12:12:12",'Complete time tidak sesuai dengan yang di update')
            })
            .end(done);
      });
      
    it('Basic User can delete game', function (done) {
        request(app)
            .delete(`/users/${idUserBasic}/game/${id_game}`)
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
            .get(`/users/${idUserBasic}/game`)
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
            .delete(`/users/${idUserPro}/game/${id_game}`)
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
            .get(`/users/${idUserPro}/game`)
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