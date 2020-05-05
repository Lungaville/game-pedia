var express = require('express');
var router = express.Router();
var httpCode = require('../utils/http-code')
const { check, validationResult } = require('express-validator');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/',[
  check('username').isAlpha(),
  check('password').isLength({min : 5 , max : 8}),
],function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpCode.VALIDATION_FAIL).json({ errors: errors.array() });
  }
  res.send('respond with a resource');
});
module.exports = router;
