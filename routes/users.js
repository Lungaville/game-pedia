var express = require('express');
var router = express.Router();
var httpCode = require('../utils/http-code')
var customValidation = require('../utils/custom_validation')
var customMiddleware = require('../utils/custom_middleware')
const model = require('../models/index');

var response = require("../utils/response_function");
const {
  check,
  validationResult
} = require('express-validator');

/* GET users listing. */
router.get('/', [customMiddleware.jwtMiddleware], async function (req, res, next) {
  const users = await model.users.findAll({

    attributes: {
      exclude: ["subscription_until"]
    }
  });
  // console.log(res.locals.user);
  return response.get(res, '', users);
});

router.get('/:id', [customMiddleware.jwtMiddleware], async function (req, res, next) {
  try {
    const userId = req.params.id;
    let user;
    if (userId != req.user_auth.id) {
      user = await model.users.findOne({
        where: {
          id: userId,
        },
        attributes: {
          exclude: ["subscription_until"]
        }
      })
    } else {
      user = await model.users.findOne({
        where: {
          id: userId,
        }
      })
    }
    if (user) {
      return response.get(res, '', user);
    } else {
      return response.notFound(res, 'User tidak ditemukan');
    }
  } catch (err) {
    res.status(400).json({
      'status': 'ERROR',
      'message': err.message,
    })
  }
});


router.get('/:id/transactions', [customMiddleware.jwtMiddleware, ], async function (req, res, next) {
  try {
    if (req.user_auth.id != req.params.id) {
      return response.forbidden(res, "You cannot access other user resource");
    }
    const userId = req.params.id;
    transaction = await model.transaction.findAll({
      where: {
        id_user: userId,
      },
      attributes: {
        exclude: ["id_user"]
      }
    })

    return response.get(res, '', transaction);
  } catch (err) {
    res.status(400).json({
      'status': 'ERROR',
      'message': err.message,
    })
  }
});

router.patch('/:id', [customMiddleware.jwtMiddleware], async function (req, res, next) {
  try {
    if (req.user_auth.tipe != 3 && req.user_auth.id != req.params.id) {
      return response.forbidden(res, "You don't have enough access to this resource");
    }
    const usersId = req.params.id;
    const gender = req.body.gender;
    const name = req.body.name;

    const select_user = await model.users.findOne({
      where: {
        id: usersId
      }
    });
    if (!select_user) {
      return response.notFound(res, 'User not found')
    }
    const users = await model.users.update({
      name,
      gender,
    }, {
      where: {
        id: usersId
      }
    });
    if (users) {
      console.log(users);
      return response.update(res, 'User berhasil diupdate');
    }
  } catch (err) {
    res.status(400).json({
      'status': 'ERROR',
      'message': err.message,
    })
  }
});

router.delete('/:id', [customMiddleware.jwtMiddleware, customMiddleware.minimumAdmin], async function (req, res, next) {

  try {
    const usersId = req.params.id;

    const select_user = await model.users.findOne({
      where: {
        id: usersId
      }
    });
    if (!select_user) {
      return response.notFound(res, 'User not found')
    }
    const users = await model.users.destroy({
      where: {
        id: usersId
      }
    })
    if (users) {
      return response.delete(res, 'User berhasil dihapus', users);
    }
  } catch (err) {
    res.status(400).json({
      'status': 'ERROR',
      'message': err.message,
    })
  }
});

module.exports = router;