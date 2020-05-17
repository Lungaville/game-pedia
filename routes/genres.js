var express = require('express');
var router = express.Router();
var httpCode = require('../utils/http-code')
var Sequelize = require('sequelize');
var customValidation = require('../utils/custom_validation')
var customMiddleware = require('../utils/custom_middleware')
const model = require('../models/index');

const { check, validationResult } = require('express-validator');

router.post('/',[
    check('name').isString(),
  ],async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpCode.VALIDATION_FAIL).json({ errors: errors.array() });
    }
    try {
      const genres = await model.genres.create(req.body);
      if (genres) {
        res.status(201).json({
          'status': 'OK',
          'messages': 'Genre berhasil ditambahkan',
          'data': genres,
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
  var whereStatement = {};
  if(req.query.name !== undefined){
    whereStatement.name = {[Sequelize.Op.like]: "%"+req.query.name+"%"}
  }
  const genres = await model.genres.findAll({where:whereStatement});
  // console.log(res.locals.user);
  return res.json({
    'status': 'OK',
    'messages': '',
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
      'messages': err.message,
    })
  }
});

router.patch('/:id', async function (req, res, next) {
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
    if (genres) {
      res.json({
        'status': 'OK',
        'messages': 'Genre berhasil diupdate',
        'data': genres,
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
    const genreId = req.params.id;
    const genres = await model.genres.destroy({ where: {
      id: genreId
    }})
    if (genres) {
      res.json({
        'status': 'OK',
        'messages': 'Genre berhasil dihapus',
        'data': genres,
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