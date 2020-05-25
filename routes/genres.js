var express = require('express');
var router = express.Router();
var httpCode = require('../utils/http-code')
var Sequelize = require('sequelize');
var customValidation = require('../utils/custom_validation')
var customMiddleware = require('../utils/custom_middleware')
const model = require('../models/index');

const { check, validationResult } = require('express-validator');

router.post('/',[
    customMiddleware.jwtMiddleware,
    customMiddleware.minimumPro,
    check('name').isString(),
  ],async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpCode.VALIDATION_FAIL).json({ errors: errors.array() });
    }
    console.log(req.user_auth.tipe)
    try {
      const genres = await model.genres.create(req.body);
      if (genres) {
        res.status(201).json({
          'status': 'OK',
          'message': 'Genre berhasil ditambahkan',
          'data': genres,
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
  var whereStatement = {};
  if(req.query.name !== undefined){
    whereStatement.name = {[Sequelize.Op.like]: "%"+req.query.name+"%"}
  }
  const genres = await model.genres.findAll({where:whereStatement});
  // console.log(res.locals.user);
  return res.json({
    'status': 'OK',
    'message': '',
    'data': genres
  })
});


router.get('/:id', async function (req, res, next) {
  try {
    const genreId = req.params.id;
    const genre = await model.genres.findOne({ where: {
      id: genreId
    }})
    if (genre) {
      res.json({
        'status': 'OK',
        'data': genre,
      })
    }
  } catch (err) {
    res.status(400).json({
      'status': 'ERROR',
      'message': err.message,
    })
  }
});

router.patch('/:id',[
  customMiddleware.jwtMiddleware,
  customMiddleware.minimumPro,
  check('name').isString(),
  ], async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpCode.VALIDATION_FAIL).json({ errors: errors.array() });
  }
  try {
    const genreId = req.params.id;
    const name = req.body.name;
    const genres = await model.genres.update({
      name
    }, {
      where: {
        id: genreId
      }
    });
    const genre = await model.genres.findOne({where:{id:genreId}})
    if (genres) {
      res.json({
        'status': 'OK',
        'message': 'Genre berhasil diupdate',
        'data': genre,
      })
    }
  } catch (err) {
    res.status(400).json({
      'status': 'ERROR',
      'message': err.message,
    })
  }
});

router.delete('/:id', [
  customMiddleware.jwtMiddleware,
  customMiddleware.minimumPro,
  ] ,async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpCode.VALIDATION_FAIL).json({ errors: errors.array() });
  }
  try {
    const genreId = req.params.id;
    const genre = await model.genres.findOne({ where:{id:genreId}})
    const genres = await model.genres.destroy({ where: {
      id: genreId
    }})
    if (genres) {
      res.json({
        'status': 'OK',
        'message': 'Genre berhasil dihapus',
        'data': genre,
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