const request = require('supertest');
const app = require('../app'); //reference to you app.js file
const responseCode = require('../utils/http-code')
const assert = require('chai').assert;
const expect = require('chai').expect;
const jwt = require('jsonwebtoken')
let genreName 
let newGenreName 
let insertGenreName 
let insertedId = 0

describe('Genre Test', function () {
    
    before(function() {
        genreName = "RPG";
        newGenreName = "RPGS";
        insertGenreName = "RPG";
        token = global.tokenPro;
    });
    
    it('Response should be when genre inserted', function (done) {
        request(app)
            .post('/genres')
            .send({name :genreName,slug : "rpg"})
            .set('Accept', 'application/json')
            .set('token',token)
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_INSERT)
            .expect(response => {
                expect(response.body.message).to.equal('Genre berhasil ditambahkan')
                insertedId = response.body.data.id
                expect(response.body.data.name).to.equal(genreName,'Nama genre yang diberikan pada resposne tidak sesuai')
            })
            .end(done);
    });
    it('Response should be when get a genre with params', function (done) {
      request(app)
          .get('/genres')
          .set('token',token)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(responseCode.OK)
          .expect(response => {
            let data = response.body.data.find((item) => item.id == insertedId);
            expect(data.name).to.equal(genreName,'Nama pada response tidak sesuai')
          })
          .end(done);
    });
    it('Response should be when get a genre with ID', function (done) {
      request(app)
          .get(`/genres/${insertedId}`)
          .set('token',token)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(responseCode.OK)
          .expect(response => {
              expect(response.body.data.name).to.equal(genreName,'Nama genre pada response tidak sesuai')
          })
          .end(done);
    });
    it('Response should be when genre updated', function (done) {
      request(app)
          .patch(`/genres/${insertedId}`)
          .send({name :newGenreName,slug : "rpg"})
          .set('Accept', 'application/json')
          .set('token',token)
          .expect('Content-Type', /json/)
          .expect(responseCode.OK)
          .expect(response => {
              expect(response.body.message).to.equal('Genre berhasil diupdate')
          })
          .end(done);
      });
      
    it('Response should be when get a genre with ID after updated', function (done) {
        request(app)
            .get(`/genres/${insertedId}`)
            .set('token',token)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
                expect(response.body.data.name).to.equal(newGenreName,'Nama genre pada response tidak sesuai')
            })
            .end(done);
      });
      it('Response should be when genre deleted', function (done) {
        request(app)
            .delete(`/genres/${insertedId}`)
            .set('Accept', 'application/json')
            .set('token',token)
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
                expect(response.body.message).to.equal('Genre berhasil dihapus')
                expect(response.body.data.name).to.equal(newGenreName,'Nama genre baru yang diberikan pada resposne tidak sesuai')
            })
            .end(done);
      });
      it('Insert genre for game seed', function (done) {
          request(app)
              .post('/genres')
              .send({name :"Testing Genre",slug : "testing-genre"})
              .set('Accept', 'application/json')
              .set('token',token)
              .expect('Content-Type', /json/)
              .expect(responseCode.SUCCESS_INSERT)
              .expect(response => {
                  expect(response.body.message).to.equal('Genre berhasil ditambahkan')
                  insertedId = response.body.data.id
                  global.seed_genre = insertedId;
                  expect(response.body.data.name).to.equal("Testing Genre",'Nama genre yang diberikan pada resposne tidak sesuai')
                  expect(response.body.data.slug).to.equal("testing-genre",'Nama genre yang diberikan pada resposne tidak sesuai')
              })
              .end(done);
      });
});