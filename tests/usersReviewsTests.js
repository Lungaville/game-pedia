const request = require('supertest');
const app = require('../app'); //reference to you app.js file
const responseCode = require('../utils/http-code')
const assert = require('chai').assert;
const expect = require('chai').expect;
const jwt = require('jsonwebtoken')

let id_game = 2
let id_user = 1
let review = 'One of best Indie games of all time. The gameplay never gets boring and there\'s story mode which is quite interesting. The game is continuously improving and the developer is going as far remake first 2 episode after harsh critique. Just buy this game!'
let review_score = 9

let review_update = 'One of best Indie games of all time. The gameplay never gets boring and there\'s story mode which is quite interesting. The game is continuously improving and the developer is going as far remake first 2 episode after harsh critique. GOTY!'
let review_score_update = 10

let token; // hard-coded
let id = null // ID of resource from GET request

describe('Users Reviews Test', function () {
    before(function() {
        token = global.tokenBasic;
    });
    it('Response should be when user review inserted', function (done) {
        request(app)
            .post('/reviews')
            .send({
                id_game: id_game,
                id_user: id_user,
                review: review,
                review_score: review_score
            })
            .set('Accept', 'application/json')
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(responseCode.SUCCESS_INSERT)
            .expect(response => {
                id = parseInt(response.body.data.id)
                expect(response.body.message).to.equal('Successfuly inserted user review', 'Response message tidak sesuai')
                expect(response.body.data.id_game).to.equal(id_game, 'ID Game yang diberikan pada response tidak sesuai')
                expect(response.body.data.id_user).to.equal(id_user, 'ID User yang diberikan pada response tidak sesuai')
                expect(response.body.data.review).to.equal(review, 'Review yang diberikan pada response tidak sesuai')
                expect(response.body.data.review_score).to.equal(review_score, 'Review Score yang diberikan pada response tidak sesuai')
            })
            .end(done);
    });
    it('Response should be when get a user review', function (done) {
        request(app)
            .get(`/reviews/${id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
                expect(response.body.data.id).to.equal(id, 'ID yang diberikan pada response tidak sesuai')
                expect(response.body.data.id_game).to.equal(id_game, 'ID Game yang diberikan pada response tidak sesuai')
                expect(response.body.data.id_user).to.equal(id_user, 'ID User yang diberikan pada response tidak sesuai')
                expect(response.body.data.review).to.equal(review, 'Review yang diberikan pada response tidak sesuai')
                expect(response.body.data.review_score).to.equal(review_score, 'Review Score yang diberikan pada response tidak sesuai')
            })
            .end(done);
    });
    it('Response should be when get all users reviews', function (done) {
        request(app)
            .get('/reviews')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
                // if index remains null, this test will fail
                let index = null
                for (let i = 0; i < response.body.data.length; i++) {
                    if (response.body.data[i].id === id) {
                        index = i
                    }
                }

                expect(response.body.data[index].id_game).to.equal(id_game, 'ID Game yang diberikan pada response tidak sesuai')
                expect(response.body.data[index].id_user).to.equal(id_user, 'ID User yang diberikan pada response tidak sesuai')
                expect(response.body.data[index].review).to.equal(review, 'Review yang diberikan pada response tidak sesuai')
                expect(response.body.data[index].review_score).to.equal(review_score, 'Review Score yang diberikan pada response tidak sesuai')
            })
            .end(done);
    });
    it('Response should be when patch a user review', function (done) {
        request(app)
            .patch(`/reviews/${id}`)
            .send({
                review: review_update,
                review_score: review_score_update
            })
            .set('Accept', 'application/json')
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
                expect(response.body.message).to.equal('User berhasil diupdate', 'Response message tidak sesuai')
            })
            .end(done);
    });
    it('Response should be when get a user review (after patch user review)', function (done) {
        request(app)
            .get(`/reviews/${id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
                expect(response.body.data.id).to.equal(id, 'ID yang diberikan pada response tidak sesuai')
                expect(response.body.data.id_game).to.equal(id_game, 'ID Game yang diberikan pada response tidak sesuai')
                expect(response.body.data.id_user).to.equal(id_user, 'ID User yang diberikan pada response tidak sesuai')
                expect(response.body.data.review).to.equal(review_update, 'Review yang diberikan pada response tidak sesuai')
                expect(response.body.data.review_score).to.equal(review_score_update, 'Review Score yang diberikan pada response tidak sesuai')
            })
            .end(done);
    });
    it('Response should be when delete a user review', function (done) {
        request(app)
            .delete(`/reviews/${id}`)
            .set('Accept', 'application/json')
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(responseCode.OK)
            .expect(response => {
                expect(response.body.message).to.equal('User review berhasil dihapus', 'Response message tidak sesuai')
            })
            .end(done);
    });

    console.log('tes');
});