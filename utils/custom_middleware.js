const httpCode =  require('./http-code')

const LEVELS = Object.freeze({
    basic: {value : 1 , name : "Basic"},
    pro: {value : 2 , name : "Pro"},
    admin: {value : 3 , name : "Admin"}
});

const model = require('../models/index');
var jwtMiddleware = async function(req, res, next) {
    let token = req.header('Token');
    if(!token){
        return res.status(httpCode.UNAUTHORIZED).json({
            'status': 'ERROR',
            'message': `Token not found in header`,
        });
    } 
    let user = await model.users.findOne({ where : {token : req.header('Token') }})
    if(user == null){  
        return res.status(httpCode.UNAUTHORIZED).json({
            'status': 'ERROR',
            'message': `Invalid Token`,
        });
    }
    req.user_auth = user;
    next();
}

function checkRole(role){
    return function(req, res, next) {
        if(req.user_auth.tipe  <role.value ){
            return res.status(httpCode.FORBIDDEN).json({
                'status': 'ERROR',
                'message': `Minimum ${role.name} to use this endpoint `,
                });
        }
        next();
    }
}

var minimumBasic = checkRole(LEVELS.basic);
var minimumPro = checkRole(LEVELS.pro);
var minimumAdmin = checkRole(LEVELS.admin);

let userReviewOwnership = async function (req, res, next) {
    let id_review = req.params.id
    let userReview = await model.users_reviews.findOne({where: {id: id_review} })

    // assume token valid since this middleware run after jwtMiddleware
    let user = await model.users.findOne({where: {token: req.header('Token')}})    
    if (user === null || user.id !== userReview.id_user) {
        return res.status(httpCode.UNAUTHORIZED).json({
            'status': 'ERROR',
            'message': `You are not owner of this resource`,
        });
    }
    next();
}

module.exports = Object.freeze({
    jwtMiddleware: jwtMiddleware,
    minimumBasic: minimumBasic,
    minimumPro : minimumPro,
    minimumAdmin: minimumAdmin,
    userReviewOwnership: userReviewOwnership
});