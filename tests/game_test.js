const request = require('supertest');
const app = require('../app'); //reference to you app.js file
const responseCode = require('../utils/http-code')
const assert = require('chai').assert;
const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
let insertedId;
let description;
let genre;
let gameName;
let token;



describe('Game Test', function () {

  before(function () {
    description = 'Monster Hunter: World is an action role-playing game';
    token = global.tokenAdmin;
    genre = [global.seed_genre];
    gameName = "Monster Hunter: World";
    slug = "monster-hunter-world"
  });

  it('Response should be when game inserted', function (done) {
    request(app)
      .post('/games')
      .send({
        name: gameName,
        description: description,
        genre: genre,
        slug: slug
      })
      .set('Accept', 'application/json')
      .set('Token', token)
      .expect('Content-Type', /json/)
      // .expect(responseCode.SUCCESS_INSERT)
      .expect(response => {
        insertedId = response.body.data.id;
        global.seed_id_game = insertedId;
        expect(response.body.message).to.equal('Game berhasil ditambahkan', 'Response message tidak sesuai');
        expect(response.body.data.description).to.equal(description, 'Description yang diberikan pada response tidak sesuai')
        expect(response.body.data.genre.length).to.equal(genre.length, 'Genre yang diberikan pada resposne tidak sesuai');
        expect(response.body.data.created_by).to.equal(global.userAdmin.id, 'token user yang diberikan pada resposne tidak sesuai')
        expect(response.body.data.slug).to.equal(slug, 'Slug pada response tidak sesuai')
      })
      .end(done);
  });
  it('Get game should contain inserted game', function (done) {
    request(app)
      .get(`/games/${insertedId}`)
      .set('Accept', 'application/json')
      .set('Token', token)
      .expect('Content-Type', /json/)
      .expect(responseCode.OK)
      .expect(response => {
        expect(response.body.data.name).to.equal(gameName, 'Nama pada response tidak sesuai')
        expect(response.body.data.slug).to.equal(slug, 'Slug pada response tidak sesuai')
        //   expect(response.body.data.developer.name).to.equal(global.userAdmin.name,'Nama developer yang diberikan pada resposne tidak sesuai')
      })
      .end(done);
  });
  it('GET all games should contain inserted games', function (done) {
    request(app)
      .get('/games')
      .set('Accept', 'application/json')
      .set('Token', token)
      .expect('Content-Type', /json/)
      .expect(responseCode.OK)
      .expect(response => {

        let data = response.body.data.find((item) => item.id == insertedId);
        expect(data.name).to.equal(gameName, 'Nama pada response tidak sesuai')
        expect(data.slug).to.equal(slug, 'Slug pada response tidak sesuai')
      })
      .end(done);
  });
});