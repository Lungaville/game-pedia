const request = require('supertest');
const app = require('../app'); //reference to you app.js file
const responseCode = require('../utils/http-code')
const assert = require('chai').assert;
const expect = require('chai').expect;
const jwt = require('jsonwebtoken')
let description = 'Monster Hunter: World is an action role-playing game'
let genre = "1,2,3"
let gameName = "The Witcher 3: Wild Hunt"
let gameName2 = "The Long Dark"
let developerName = "richard"
let developerName2 = "Ricahrd"
let developerId = 1
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InJpY2hhcmQiLCJlbWFpbCI6InJpY2hhcmRAZ21haWwuY29tIiwicGhvbmVfbnVtYmVyIjoiMDg1MTM4Mzg0NzUiLCJnZW5kZXIiOnRydWUsInRpcGUiOjEsImNyZWF0ZWRfYXQiOiIyMDIwLTA1LTIyVDEzOjIzOjU0LjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAyMC0wNS0yM1QwNzowMzo1Mi4wMDBaIiwiaWF0IjoxNTkwMjE4OTg3LCJleHAiOjE1OTAzMDUzODd9.UOT-UwmdMWTpvF1KWqZx0p4sUg1PN8pTYFtm-A27vZY"
// let token = global.tokenAdmin;
describe('Game Test', function () {
    it('Response should be when game inserted', function (done) {
        request(app)
            .post('/games')
            .send({name :'Monster Hunter: World' , description : "Monster Hunter: World is an action role-playing game", created_by : 1, genre: "1,2,3"})
            .set('Accept', 'application/json')
            .set('token',token)
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_INSERT)
            .expect(response => {
                expect(response.body.message).to.equal('Game berhasil ditambahkan','Response message tidak sesuai');
                expect(response.body.data.description).to.equal(description,'Description yang diberikan pada response tidak sesuai')
                expect(response.body.data.genre).to.equal(genre,'Genre yang diberikan pada resposne tidak sesuai'),
                expect(response.body.data.created_by).to.equal(developerId,'token user yang diberikan pada resposne tidak sesuai')
            })
            .end(done);
    });
    it('Response should be when get a game', function (done) {
      request(app)
          .get('/games/1')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(responseCode.OK)
          .expect(response => {
              expect(response.body.data.name).to.equal(gameName,'Nama pada response tidak sesuai')
              expect(response.body.data.developer.name).to.equal(developerName,'Nama developer yang diberikan pada resposne tidak sesuai')
          })
          .end(done);
    });
    it('Response should be when get all game', function (done) {
      request(app)
          .get('/games')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(responseCode.OK)
          .expect(response => {
              expect(response.body.data[1].name).to.equal(gameName2,'Nama pada response tidak sesuai')
              expect(response.body.data[1].developer.name).to.equal(developerName2,'Nama developer yang diberikan pada resposne tidak sesuai')
          })
          .end(done);
    });
    console.log('tes');
});