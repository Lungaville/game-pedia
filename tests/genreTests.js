const request = require('supertest');
const app = require('../app'); //reference to you app.js file
const responseCode = require('../utils/http-code')
const assert = require('chai').assert;
const expect = require('chai').expect;
const jwt = require('jsonwebtoken')
let genreName = "RPG"
let newGenreName = "RPGS"
let insertGenreName = "RPG"
let newId = 0
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsIm5hbWUiOiJyaWNoYXJkMiIsImVtYWlsIjoicmljaGFyZDJAZ21haWwuY29tIiwicGhvbmVfbnVtYmVyIjoiMDg1MTM4Mzg0NzUiLCJnZW5kZXIiOnRydWUsInRpcGUiOjMsImNyZWF0ZWRfYXQiOiIyMDIwLTA1LTIzVDA2OjU3OjIzLjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAyMC0wNS0yM1QwNjo1NzoyMy4wMDBaIiwiaWF0IjoxNTkwMjE3NTUwLCJleHAiOjE1OTAzMDM5NTB9.f0ymZbZypumvCcN3JlbbNmZMWyDIMEZxltikF0szhfg"

describe('Genre Test', function () {
    it('Response should be when genre inserted', function (done) {
        request(app)
            .post('/genres')
            .send({name :'RPG'})
            .set('Accept', 'application/json')
            .set('token',token)
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_INSERT)
            .expect(response => {
                expect(response.body.message).to.equal('Genre berhasil ditambahkan')
                newId = response.body.data.id
                expect(response.body.data.name).to.equal(insertGenreName,'Nama genre yang diberikan pada resposne tidak sesuai')
            })
            .end(done);
    });
    it('Response should be when get a genre with params', function (done) {
      request(app)
          .get('/genres?name=g')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(responseCode.OK)
          .expect(response => {
              expect(response.body.data[0].name).to.equal(genreName,'Nama genre pada response tidak sesuai')
          })
          .end(done);
    });
    it('Response should be when get a genre with ID', function (done) {
      request(app)
          .get(`/genres/${newId}`)
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
          .patch(`/genres/${newId}`)
          .send({name :'RPGS'})
          .set('Accept', 'application/json')
          .set('token',token)
          .expect('Content-Type', /json/)
          .expect(responseCode.OK)
          .expect(response => {
              expect(response.body.message).to.equal('Genre berhasil diupdate')
              expect(response.body.data.name).to.equal(newGenreName,'Nama genre baru yang diberikan pada resposne tidak sesuai')
          })
          .end(done);
      });
      it('Response should be when genre deleted', function (done) {
        request(app)
            .delete(`/genres/${newId}`)
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
    console.log('tes');
});