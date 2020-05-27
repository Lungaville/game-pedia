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
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InJpY2hhcmQiLCJlbWFpbCI6InJpY2hhcmRAZ21haWwuY29tIiwicGhvbmVfbnVtYmVyIjoiMDg1MTM4Mzg0NzUiLCJnZW5kZXIiOnRydWUsInRpcGUiOjEsImNyZWF0ZWRfYXQiOiIyMDIwLTA1LTIxVDExOjE3OjE1LjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAyMC
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InJpY2hhcmQiLCJlbWFpbCI6InJpY2hhcmRAZ21haWwuY29tIiwicGhvbmVfbnVtYmVyIjoiMDg1MTM4Mzg0NzUiLCJnZW5kZXIiOnRydWUsInRpcGUiOjEsImNyZWF0ZWRfYXQiOiIyMDIwLTA1LTIxVDExOjE3OjE1LjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAyMC0wNS0yMVQxMToxODowOC4wMDBaIiwiaWF0IjoxNTkwMDU5OTY1LCJleHAiOjE1OTAxNDYzNjV9.rGEI59TCKqxumPhEt-27GQvGDNOVz2tt10l0b9BV2Mgg
  try {
  let user = await model.users.findOne({where : {email : req.body.email}});
  // console.log(user);
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
    console.log(token);
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