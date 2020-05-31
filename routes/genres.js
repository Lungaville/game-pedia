var express = require('express');
var router = express.Router();
var httpCode = require('../utils/http-code')
var Sequelize = require('sequelize');
var customValidation = require('../utils/custom_validation')
var customMiddleware = require('../utils/custom_middleware')
var response = require('../utils/response_function')
const model = require('../models/index');

const igdb = require('igdb-api-node').default;
const { check, validationResult } = require('express-validator');

function checkSlugExists(slug) {
  return model.genres.findOne({ where: { slug: slug } });
}
router.post('/',[
    customMiddleware.jwtMiddleware,
    customMiddleware.minimumPro,
    check('name').isString(),
    check("slug").isString().isSlug(),
  ],async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpCode.VALIDATION_FAIL).json({ errors: errors.array() });
    }
    if(await checkSlugExists(req.body.slug) !=null){
      response.duplicate(res,"Slug already exists")
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

router.get('/',
customMiddleware.jwtMiddleware,async function(req, res, next) {
  try {
    var whereStatement = {};
    const response = await igdb("f242556c12ac37ed908b6751edd2fb9a")
    .fields(['name', 'slug'])
    .limit(100) 
    .request('/genres'); 
    var data = response.data;
    for (const item of data) {
      await model.genres.findOrCreate({where:{slug : item.slug}, defaults : {slug : item.slug, name: item.name, id_ogdb : item.id} });
    }
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
    
  } catch (error) {
    return res.json(error);
  }
});


router.get('/:id', 
[customMiddleware.jwtMiddleware,check("id").isNumeric()],async function (req, res, next) {
  try {
    const genreId = req.params.id;
    const genre = await model.genres.findOne({ 
      where: { id: genreId },
      // attributes: { exclude: ["updated_at", "created_at"]}
    })
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
  check('id').isNumeric(),
  ], async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpCode.VALIDATION_FAIL).json({ errors: errors.array() });
  }
  try {
    const genreId = req.params.id;
    const name = req.body.name;
    const slug = req.body.slug;
    const genres = await model.genres.update({
      "name" : name,
      "slug" : slug
    }, {
      where: {
        id: genreId
      }
    });
    const genre = await model.genres.findOne({
      where:{id:genreId},
      // attributes: { exclude: ["updated_at", "created_at"]}
    })
    if (genres) {
      res.json({
        'status': 'OK',
        'message': 'Genre berhasil diupdate',
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
  check("id").isNumeric()
  ] ,async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpCode.VALIDATION_FAIL).json({ errors: errors.array() });
  }
  try {
    const genreId = req.params.id;
    const genre = await model.genres.findOne({ 
      where:{id:genreId},
      // attributes: { exclude: ["updated_at", "created_at"]}
    })
    const genres = await model.genres.destroy({ where: {
      id: genreId
    }})
    const foreignGenres = await model.genre_games.destroy({ where : {
      id_genre: genreId
    }})
    if (genres || foreignGenres) {
      res.json({
        'status': 'OK',
        'message': 'Genre berhasil dihapus',
        'data': genre,
      })
    }else{
      res.json({
        'status': 'Error',
        'message': 'Something error in server'
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