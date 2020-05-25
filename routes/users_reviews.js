var express = require('express');
var router = express.Router();
var httpCode = require('../utils/http-code')
var customValidation = require('../utils/custom_validation')
var customMiddleware = require('../utils/custom_middleware')
const {
    check,
    validationResult
} = require('express-validator');
const model = require('../models/index');

/* GET reviews  */
router.get('/', async (req, res, next) => {
    const reviews = await model.users_reviews.findAll({});
    console.log(res.locals.reviews);
    return res.json({
        'status': 'OK',
        'message': '',
        'data': reviews
    })
});

router.get('/:id', [
    check('id').custom(customValidation.reviewExist),
], async (req, res, next) => {
    try {
        const review = await model.users_reviews.findOne({
            where: {
                'id': req.params.id
            }
        });
        console.log(res.locals.review);
        return res.json({
            'status': 'OK',
            'message': '',
            'data': review
        })
    } catch (err) {
        res.status(400).json({
            'status': 'ERROR',
            'message': err.message,
            'data': {},
        })
    }
})

router.post('/', [
    customMiddleware.jwtMiddleware,
    customMiddleware.minimumBasic,
    check('id_game').notEmpty().isNumeric().custom(customValidation.gameExists),
    check('id_user').notEmpty().isNumeric().custom(customValidation.userExists),
    check('review').notEmpty().isString(),
    check('review_score').notEmpty().isNumeric().custom(score => {
        if (score < 1 || score > 10) {
            return Promise.reject('Review score is not in range 1-10')
        } else {
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
    try {
        const data = {
            id_game: req.body.id_game,
            id_user: req.body.id_user,
            review: req.body.review,
            review_score: req.body.review_score,
        }
        console.log(data);
        const user_review = await model.users_reviews.create(data)
        if (user_review) {
            res.status(201).json({
                'status': 'OK',
                'message': 'Successfuly inserted user review',
                'data': user_review,
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

router.patch('/:id', [
    customMiddleware.jwtMiddleware,
    customMiddleware.userReviewOwnership,
    // TO DO : Validate ownership, unless user type is admin
    check('id').custom(customValidation.reviewExist),
    check('review').notEmpty().isString(),
    check('review_score').notEmpty().isNumeric().custom(rating => {
        if (rating < 1 || rating > 10) {
            return Promise.reject('Rating is not in range 1-10')
        } else {
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
    try {
        const id = req.params.id;
        const {
            review,
            review_score
        } = req.body;
        const user_review = await model.users_reviews.update({
            review,
            review_score
        }, {
            where: {
                id: id
            }
        });
        if (user_review) {
            res.json({
                'status': 'OK',
                'message': 'User berhasil diupdate',
                'data': user_review,
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
    customMiddleware.userReviewOwnership,
    // TO DO : Validate ownership, unless user type is admin
    check('id').custom(customValidation.reviewExist),
], async (req, res, next) => {
    try {
        const id = req.params.id;
        const user_review = await model.users_reviews.destroy({
            where: {
                id: id
            }
        })
        if (user_review) {
            res.json({
                'status': 'OK',
                'message': 'User review berhasil dihapus',
                'data': user_review,
            })
        }
    } catch (err) {
        res.status(400).json({
            'status': 'ERROR',
            'message': err.message,
        })
    }
})

module.exports = router;