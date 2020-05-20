var express = require('express');
var router = express.Router();
var httpCode = require('../utils/http-code')
var customValidation = require('../utils/custom_validation')
const model = require('../models/index');

const { check, validationResult } = require('express-validator');

router.post('/:id_user/game',[
    check('id_user').isNumeric().custom(customValidation.userExists).custom(customValidation.userGameUnique),
    check('id_game').isNumeric().custom(customValidation.gameExists),
  ], async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpCode.VALIDATION_FAIL).json({ errors: errors.array() });
    }
    try {
      const data = {
        id_user : req.params.id_user,
        id_game : req.body.id_game,
      }
      console.log(data);
      const user_game = await model.users_games.create(data);
      if (user_game) {
        res.status(201).json({
          'status': 'OK',
          'message': 'Successfuly inserted user game',
          'data': user_game,
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
  
  router.get('/:id_user/game',[
    check('id_user').isNumeric().custom(customValidation.userExists).custom(customValidation.userGameUnique),
  ], async function (req, res, next) {
    try {
      const user_games = await model.users_games.findAll({where : {
        'id_user' : req.params.id_user
      }});
      return res.json({
        'status': 'OK',
        'message': '',
        'data': user_games
      })
    }
    catch(err){
      res.status(400).json({
        'status': 'ERROR',
        'message': err.message,
        'data': {},
      })
    }
  })
  
  router.delete('/:id_user/game/:id_game',[
    check('id_user').isNumeric().custom(customValidation.userExists),
    check('id_game').isNumeric().custom(customValidation.gameExists),
  ], async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpCode.VALIDATION_FAIL).json({ errors: errors.array() });
    }
    try {
      const data = {
        id_user : req.params.id_user,
        id_game : req.params.id_game,
      }
      let user_game = await model.users_games.findOne({where : data });
      if(user_game ==null){
       return res.status(400).json({
          'status': 'ERROR',
          'message': 'User game not found',
        })
  
      }
      user_game = await user_game.destroy();
      if (user_game) {
        res.status(201).json({
          'status': 'OK',
          'message': 'Successfuly deleted user game',
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
  
  module.exports = router;
  