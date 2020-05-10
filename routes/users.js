var express = require('express');
var router = express.Router();
var httpCode = require('../utils/http-code')
const model = require('../models/index');

const { check, validationResult } = require('express-validator');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const users = await model.users.findAll({});
  return res.json({
    'status': 'OK',
    'messages': '',
    'data': users
  })
});

router.post('/',[
  check('name').isAlpha(),
  check('email').isLength({min : 5 , max : 8}),
  check('gender').isNumeric(),
  check('phoneNumber').isNumeric(),
],async function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpCode.VALIDATION_FAIL).json({ errors: errors.array() });
  }
  try {
  const users = await model.users.create(req.body);
  if (users) {
    res.status(201).json({
      'status': 'OK',
      'messages': 'User berhasil ditambahkan',
      'data': users,
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
        'messages': 'User berhasil diupdate',
        'data': users,
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
      'data': {},
    })
  }
});
module.exports = router;
