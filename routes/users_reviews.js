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
var response = require("../utils/response_function");

/* GET reviews  */
router.get('/',
    customMiddleware.jwtMiddleware, async (req, res, next) => {

        let whereParam = {};
        whereParam.id_user = req.params.id_user;
        if (req.query.id_game != undefined) whereParam.id_game = req.query.id_game;
        const reviews = await model.users_reviews.findAll({
            where: whereParam
        });
        return res.json({
            'status': 'OK',
            'message': '',
            'data': reviews
        })
    });

router.get('/:id', [
    check('id').custom(customValidation.reviewExist),
    customMiddleware.jwtMiddleware
], async (req, res, next) => {
    try {
        const review = await model.users_reviews.findOne({
            where: {
                'id': req.params.id
            }
        });
        if (review != null)
            return res.json({
                'status': 'OK',
                'message': '',
                'data': review
            })
        else {
            return response.notFound(res, "Review tidak ditemukan");
        }
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
        const review = await model.users_reviews.findOne({
            where: {
                id_game: req.body.id_game,
                id_user: req.body.id_user
            }
        })
        if (review) {
            return response.duplicate(res, "User already rate this game")
        }
        if (req.user_auth.tipe != 3 && parseInt(req.user_auth.id) != parseInt(req.body.id_user)) {
            return response.forbidden(res, "You don't have enough access to this resource");
        }
        const data = {
            id_game: req.body.id_game,
            id_user: req.body.id_user,
            review: req.body.review,
            review_score: req.body.review_score,
        }
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
    check('id'),
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

        const selectReview = await model.users_reviews.findOne({
            where: {
                'id': req.params.id
            }
        });
        if (selectReview) {
            if (req.user_auth.tipe != 3 && req.user_auth.id != selectReview.id_user) {
                return response.forbidden(res, 'Tidak bisa mengedit review orang lain')
            }

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
            const updated_user_review = await model.users_reviews.findOne({
                where: {
                    id: id
                }
            });
            if (updated_user_review) {
                return response.update(res, 'User berhasil diupdate')
            }
        } else {

            return response.notFound(res, 'Review tidak ditemukan')
        }
    } catch (err) {
        return res.status(400).json({
            'status': 'ERROR',
            'message': err.message,
        })
    }
});

router.delete('/:id', [
    customMiddleware.jwtMiddleware,
    // TO DO : Validate ownership, unless user type is admin
    check('id'),
], async (req, res, next) => {
    try {
        const selectReview = await model.users_reviews.findOne({
            where: {
                id: req.params.id
            }
        });
        if (selectReview) {
            if (req.user_auth.tipe != 3 && req.user_auth.id != selectReview.id_user) {
                return response.forbidden(res, 'Tidak bisa mengedit review orang lain')
            }
            const id = req.params.id;
            const user_review = await model.users_reviews.destroy({
                where: {
                    id: id
                }
            })
            if (user_review) {
                return response.delete(
                    res,
                    'User Review berhasil dihapus'
                );
            }
        } else {

            return response.notFound(res, 'Review tidak ditemukan')
        }

    } catch (err) {
        return res.status(400).json({
            'status': 'ERROR',
            'message': err.message,
        })
    }
})

module.exports = router;