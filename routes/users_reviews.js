var express = require('express');
var router = express.Router();
var httpCode = require('../utils/http-code')
var customValidation = require('../utils/custom_validation')
const {
    check,
    validationResult
} = require('express-validator');

/* GET reviews  */
router.get('/', async (req, res, next) => {
    res.send('respond with a resource');
});

router.get('/:id', [
    check('id').custom(customValidation.reviewExist),
], async (req, res, next) => {
    res.send('respond with a resource');
})

router.post('/', [
    check('gameid').notEmpty().isNumeric().custom(customValidation.gameExists),
    check('title').notEmpty().isString(),
    check('body').notEmpty().isString(),
    check('rating').notEmpty().isNumeric().custom(rating => {
        if (rating < 1 || rating > 10) {
            return Promise.reject('Rating is not in range 1-10')
        }else{
            return Promise.resolve()
        }
    })
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(httpCode.VALIDATION_FAIL).json({
            errors: errors.array()
        });
    }
    res.send('respond with a resource');
});

router.put('/:id', [
    check('id').custom(customValidation.reviewExist),
    check('title').notEmpty().isString(),
    check('body').notEmpty().isString(),
    check('rating').notEmpty().isNumeric().custom(rating => {
        if (rating < 1 || rating > 10) {
            return Promise.reject('Rating is not in range 1-10')
        }else{
            return Promise.resolve()
        }
    })
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(httpCode.VALIDATION_FAIL).json({
            errors: errors.array()
        });
    }
    res.send('respond with a resource');
});

router.delete('/:id', [
    check('id').custom(customValidation.reviewExist),
], async (req, res, next) => {
    res.send('respond with a resource');
})

module.exports = router;
