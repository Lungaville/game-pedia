var express = require('express');
var router = express.Router();
var httpCode = require('../utils/http-code')
const {
    check,
    validationResult
} = require('express-validator');

/* GET reviews  */
router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

router.get('/:id', (req, res, next) => {
    // TO DO : CHECK ID EXIST
    res.send('respond with a resource');
})

router.post('/', [
    check('gameid').notEmpty().isNumeric().custom(gameid => {
        // if (gameIdExist(gameid)) {
            return Promise.resolve()
        // } else {
        //     return Promise.reject('Game ID tidak ada di database')
        // }
    }),
    check('title').notEmpty().isString(),
    check('body').notEmpty().isString(),
    check('rating').notEmpty().isNumeric().custom(rating => {
        if (rating < 1 || rating > 10) {
            return Promise.reject('Rating is not in range 1-10')
        }else{
            return Promise.resolve()
        }
    })
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(httpCode.VALIDATION_FAIL).json({
            errors: errors.array()
        });
    }
    res.send('respond with a resource');
});

router.put('/:id', [
    check('title').notEmpty().isString(),
    check('body').notEmpty().isString(),
    check('rating').notEmpty().isNumeric().custom(rating => {
        if (rating < 1 || rating > 10) {
            return Promise.reject('Rating is not in range 1-10')
        }else{
            return Promise.resolve()
        }
    })
], (req, res, next) => {
    // TO DO : CHECK ID EXIST
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(httpCode.VALIDATION_FAIL).json({
            errors: errors.array()
        });
    }
    res.send('respond with a resource');
});

router.delete('/:id', (req, res, next) => {
    // TO DO : CHECK ID EXIST
    res.send('respond with a resource');
})

module.exports = router;
