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
    const games = await model.games.create(req.body);
    if (games) {
      res.status(201).json({
        'status': 'OK',
        'messages': 'Game berhasil ditambahkan',
        'data': games,
      })
    }
   } catch (err) {
     res.status(400).json({
       'status': 'ERROR',
       'messages': err.message,
       'data': {},
     })
   }
  });

router.get('/',async function(req, res, next) {
  const games = await model.games.findAll({});
  // console.log(res.locals.user);
  return res.json({
    'status': 'OK',
    'messages': '',
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
      'messages': err.message,
    })
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const usersId = req.params.id;
    const users = await model.users.destroy({ where: {
      id: usersId
    }})
    if (users) {
      res.json({
        'status': 'OK',
        'messages': 'User berhasil dihapus',
        'data': users,
      })
    }
  } catch (err) {
    res.status(400).json({
      'status': 'ERROR',
      'messages': err.message,
    })
  }
});

module.exports= router;