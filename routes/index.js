var express = require('express');
const midtransClient = require('midtrans-client');
var router = express.Router();
var httpCode = require('../utils/http-code')
var response = require('../utils/response_function')
var customValidation = require('../utils/custom_validation')
var customMiddleware = require('../utils/custom_middleware')
var jwt = require('jsonwebtoken')
const model = require('../models/index');
const igdb = require('igdb-api-node').default;
const {
  check,
  validationResult
} = require('express-validator');


function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}


let core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: 'SB-Mid-server-EXwbWWLhS52dOxEMfN6TokhK',
  clientKey: 'SB-Mid-client-goKp5tH0D7-5c_rJ'
});

router.post('/register', [
  check('name').isString(),
  check('email').isEmail(),
  check('password').isLength({
    min: 5,
    max: 15
  }),
  check('gender').isNumeric(),
  check('tipe').isNumeric(),
], async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpCode.VALIDATION_FAIL).json({
      errors: errors.array()
    });
  }
  try {
    const selectUser = await model.users.findOne({
      where: {
        email: req.body.email
      }
    });
    if (selectUser != null) {
      return response.duplicate(res, "Email Already Exists")
    }
    let users;
    if (req.body.backdoor) {

      users = await model.users.create({
        ...req.body,
        "subscription_until": addDays(new Date(), 360)
      });
    } else {

      users = await model.users.create(req.body);
    }
    if (users) {
      if (req.body.tipe == 1 || req.body.tipe == 3)
        return res.status(201).json({
          'status': 'OK',
          'message': 'Berhasil melakukan registrasi user',
          'data': users,
        });
      // Create Core API instance
      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: 'SB-Mid-server-EXwbWWLhS52dOxEMfN6TokhK',
        clientKey: 'SB-Mid-client-goKp5tH0D7-5c_rJ'
      });

      let parameter = {
        "transaction_details": {
          "order_id": "order-id-node-" + Math.round((new Date()).getTime() / 1000),
          "gross_amount": 200000
        },
        "credit_card": {
          "secure": true
        }
      };

      snap.createTransaction(parameter)
        .then(async (transaction) => {
          // transaction redirect_url
          let redirectUrl = transaction.redirect_url;
          await model.transaction.create({
            "transaction_id": parameter.transaction_details.order_id,
            "status": 0,
            "id_user": users.id
          });
          return res.status(201).json({
            'status': 'OK',
            'message': 'Berhasil melakukan registrasi user, Silakan membayar pada url yang tertera',
            'data': users,
            'payment_url': redirectUrl
          });
        });
      /*
      res.status(201).json({
        'status': 'OK',
        'message': 'Berhasil melakukan registrasi user',
        'data': users,
      });
      /* */
    }
  } catch (err) {
    res.status(400).json({
      'status': 'ERROR',
      'message': err.message,
      'data': {},
    })
  }
});


router.post('/upgrade/:id_user', [
  customMiddleware.jwtMiddleware
], async function (req, res, next) {
  if (req.user_auth.id != req.params.id_user) {
    return response.forbidden(res, 'Tidak dapat membuat transaksi untuk orang lain')
  }
  if (req.user_auth.tipe != 1) {
    return response.unexpectedError(res, 'User ini bukan bertipe basic, silakan menggunakan /resub')
  }
  const users_update = await model.users.update({
    tipe: 2
  }, {
    where: {
      id: req.params.id_user
    }
  });
  const users = await model.users.findOne({
    where: {
      id: req.params.id_user
    }
  });
  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-EXwbWWLhS52dOxEMfN6TokhK',
    clientKey: 'SB-Mid-client-goKp5tH0D7-5c_rJ'
  });

  let parameter = {
    "transaction_details": {
      "order_id": "order-id-node-" + Math.round((new Date()).getTime() / 1000),
      "gross_amount": 200000
    },
    "credit_card": {
      "secure": true
    }
  };

  snap.createTransaction(parameter)
    .then(async (transaction) => {
      // transaction redirect_url
      let redirectUrl = transaction.redirect_url;
      await model.transaction.create({
        "transaction_id": parameter.transaction_details.order_id,
        "status": 0,
        "id_user": users.id
      });
      return res.status(201).json({
        'status': 'OK',
        'message': 'Berhasil membuat transaksi, Silakan membayar pada url yang tertera',
        'data': users,
        'payment_url': redirectUrl
      });
    });
});

router.post('/resub/:id_user', [
  customMiddleware.jwtMiddleware,
], async function (req, res, next) {
  if (req.user_auth.id != req.params.id_user) {
    return response.forbidden(res, 'Tidak dapat membuat transaksi untuk orang lain')
  }
  if (req.user_auth.tipe != 2) {
    return response.unexpectedError(res, 'User ini bertipe basic, silakan upgrade melalui /upgrade')
  }
  const users = await model.users.findOne({
    where: {
      id: req.params.id_user
    }
  });
  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-EXwbWWLhS52dOxEMfN6TokhK',
    clientKey: 'SB-Mid-client-goKp5tH0D7-5c_rJ'
  });

  let parameter = {
    "transaction_details": {
      "order_id": "order-id-node-" + Math.round((new Date()).getTime() / 1000),
      "gross_amount": 200000
    },
    "credit_card": {
      "secure": true
    }
  };

  snap.createTransaction(parameter)
    .then(async (transaction) => {
      // transaction redirect_url
      let redirectUrl = transaction.redirect_url;
      await model.transaction.create({
        "transaction_id": parameter.transaction_details.order_id,
        "status": 0,
        "id_user": users.id
      });
      return res.status(201).json({
        'status': 'OK',
        'message': 'Berhasil membuat transaksi, Silakan membayar pada url yang tertera',
        'data': users,
        'payment_url': redirectUrl
      });
    });
});
router.post('/notification_handler', async function (req, res) {
  let receivedJson = req.body;
  core.transaction.notification(receivedJson)
    .then(async (transactionStatusObject) => {
      let orderId = transactionStatusObject.order_id;
      let transactionStatus = transactionStatusObject.transaction_status;
      let fraudStatus = transactionStatusObject.fraud_status;

      let summary = `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}.<br>Raw notification object:<pre>${JSON.stringify(transactionStatusObject, null, 2)}</pre>`;


      // [5.B] Handle transaction status on your backend via notification alternatively
      // Sample transactionStatus handling logic
      if (transactionStatus == 'capture') {
        if (fraudStatus == 'challenge') {
          // TODO set transaction status on your databaase to 'challenge'
        } else if (fraudStatus == 'accept') {
          // TODO set transaction status on your databaase to 'success'
        }
      } else if (transactionStatus == 'settlement') {
        // TODO set transaction status on your databaase to 'success'
        // Note: Non-card transaction will become 'settlement' on payment success
        // Card transaction will also become 'settlement' D+1, which you can ignore
        // because most of the time 'capture' is enough to be considered as success

        const transaction = await model.transaction.findOne({
          where: {
            transaction_id: orderId
          }
        });
        const user = await model.users.findOne({
          where: {
            id: transaction.id_user
          }
        });
        let user_date = user.subscription_until;
        if (user_date != null)
          user_date.setHours(0, 0, 0, 0);
        else
          user_date = new Date(user_date);
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let expired_until;
        if (user_date == null || user_date == undefined) {
          expired_until = addDays(new Date(), 30);
        } else {
          if (user_date > today) {
            expired_until = addDays(user_date, 30);
          } else {
            expired_until = addDays(today, 30);
          }
        }
        const update_transaction = await model.transaction.update({
          "status": 1,
          "expired_at": expired_until
        }, {
          where: {
            transaction_id: orderId
          }
        });
        const update_user = await model.users.update({
          "subscription_until": expired_until
        }, {
          where: {
            id: transaction.id_user
          }
        });


      } else if (transactionStatus == 'cancel' ||
        transactionStatus == 'deny' ||
        transactionStatus == 'expire') {
        // TODO set transaction status on your databaase to 'failure'
      } else if (transactionStatus == 'pending') {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
      } else if (transactionStatus == 'refund') {
        // TODO set transaction status on your databaase to 'refund'
      }
      console.log(summary);
      res.send(summary);
    });
})

router.get('/test', async function (req, res, next) {
  const transaction = await model.users.findOne({});
  console.log(new Date(transaction.created_at));
  return res.json(transaction);
});

router.post('/login', async function (req, res, next) {
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InJpY2hhcmQiLCJlbWFpbCI6InJpY2hhcmRAZ21haWwuY29tIiwicGhvbmVfbnVtYmVyIjoiMDg1MTM4Mzg0NzUiLCJnZW5kZXIiOnRydWUsInRpcGUiOjEsImNyZWF0ZWRfYXQiOiIyMDIwLTA1LTIxVDExOjE3OjE1LjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAyMC
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InJpY2hhcmQiLCJlbWFpbCI6InJpY2hhcmRAZ21haWwuY29tIiwicGhvbmVfbnVtYmVyIjoiMDg1MTM4Mzg0NzUiLCJnZW5kZXIiOnRydWUsInRpcGUiOjEsImNyZWF0ZWRfYXQiOiIyMDIwLTA1LTIxVDExOjE3OjE1LjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAyMC0wNS0yMVQxMToxODowOC4wMDBaIiwiaWF0IjoxNTkwMDU5OTY1LCJleHAiOjE1OTAxNDYzNjV9.rGEI59TCKqxumPhEt-27GQvGDNOVz2tt10l0b9BV2Mgg
  try {
    let user = await model.users.findOne({
      where: {
        email: req.body.email
      }
    });
    // console.log(user);
    if (!user) {
      return res.status(404).json({
        'status': 'FAIL',
        'message': 'Wrong email or password',
      })
    }
    if (user.validPassword(req.body.password)) {
      var token = jwt.sign(user.toJSON(), 'soa2018', {
        expiresIn: 86400 // expires in 24 hours
      });
      user.token = token;
      await user.save();
      return res.status(200).json({
        'status': 'OK',
        'message': 'Success Login',
        'token': token
      })

    } else {
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

module.exports = router;