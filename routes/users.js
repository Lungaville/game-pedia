var express = require('express');
var router = express.Router();
var httpCode = require('../utils/http-code')
var customValidation = require('../utils/custom_validation')
var customMiddleware = require('../utils/custom_middleware')
const model = require('../models/index');

const { check, validationResult } = require('express-validator');

/* GET users listing. */
router.get('/',[customMiddleware.jwtMiddleware,customMiddleware.minimumPro] ,async function(req, res, next) {
  const users = await model.users.findAll({});
  // console.log(res.locals.user);
  return res.json({
    'status': 'OK',
    'message': '',
    'data': users
  })
});

router.get('/:id', async function(req, res, next) {
  try {
    const userId = req.params.id;
    const user = await model.users.findOne({ where: {
      id: userId
    }})
    if (user) {
      res.json({
        'status': 'OK',
        'data': user,
      })
    }
  } catch (err) {
    res.status(400).json({
      'status': 'ERROR',
      'message': err.message,
    })
  }
});

router.patch('/:id', async function (req, res, next) {
  try {
    const usersId = req.params.id;
    const {
      name,
      email,
      gender,
      phoneNumber
    } = req.body;
    const users = await model.users.update({
      name,
      email,
      gender,
      phone_number: phoneNumber
    }, {
      where: {
        id: usersId
      }
    });
    if (users) {
      res.json({
        'status': 'OK',
        'message': 'User berhasil diupdate',
        'data': users,
      })
    }
  } catch (err) {
    res.status(400).json({
      'status': 'ERROR',
      'message': err.message,
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
        'message': 'User berhasil dihapus',
        'data': users,
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