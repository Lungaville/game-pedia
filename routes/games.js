var express = require('express');
var router = express.Router();
var httpCode = require('../utils/http-code')
var customValidation = require('../utils/custom_validation')
var customMiddleware = require('../utils/custom_middleware')
const model = require('../models/index');

const { check, validationResult } = require('express-validator');

router.post('/',[
    check('name').isString(),
    check('description').isString(),
    check('developer').isString(),
  ],async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpCode.VALIDATION_FAIL).json({ errors: errors.array() });
    }
    try {
    const queryGames = await model.games.create(req.body);
    const game = await model.games.findOne({ where: {
      name: req.body.name
    }})
    const genre = game.genre
    genre.split(",").map(async genre => {
      const queryGenre = await model.genre_games.create({id:null,id_game:game.id,id_genre:genre})
    })
    if (queryGames) {
      res.status(201).json({
        'status': 'OK',
        'message': 'Game berhasil ditambahkan',
        'data': games,
      })
    }
   } catch (err) {
     res.status(400).json({
       'status': 'ERROR',
       'message': err.message,
       'data': {},
     })
   }
  });

router.get('/',async function(req, res, next) {
  const games = await model.games.findAll({});
  // console.log(res.locals.user);
  return res.json({
    'status': 'OK',
    'message': '',
    'data': games
  })
});


router.get('/:id', async function (req, res, next) {
  try {
    const gameId = req.params.id;
    const game = await model.games.findOne({ where: {
      id: gameId
    }})
    if (game) {
      res.json({
        'status': 'OK',
        'data': game,
      })
    }
  } catch (err) {
    res.status(400).json({
      'status': 'ERROR',
      'message': err.message,
    })
  }
});



module.exports= router;