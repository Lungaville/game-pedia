var express = require('express');
var router = express.Router();
var httpCode = require('../utils/http-code')
var customValidation = require('../utils/custom_validation')
var jwt = require('jsonwebtoken')
const model = require('../models/index');

const { check, validationResult } = require('express-validator');
router.post('/register',[
    check('name').isString(),
    check('email').isEmail(),
    check('password').isLength({min : 5 , max : 15}),
    check('gender').isNumeric(),
    check('phone_number').isString(),
    check('tipe').isNumeric(),
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
        'message': 'Berhasil melakukan registrasi user',
        'data': users,
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

  
router.post('/login',async function(req, res, next) {
  try {
  const user = await model.users.findOne({where : {email : req.body.email}});
  if (!user) {
    return res.status(404).json({
      'status': 'FAIL',
      'message': 'Wrong email or password',
    })
  }
  if(user.validPassword(req.body.password)){
    var token = jwt.sign( user.toJSON(), 'soa2018', {
      expiresIn: 86400 // expires in 24 hours
    });
    user.token = token;
    await user.save();
    return res.status(200).json({
      'status': 'OK',
      'message': 'Success Login',
      'token' : token
    })
    
  }else{
    return res.status(404).json({
      'status': 'FAIL',
      'message': 'Email atau Password Salah',
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