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
        if(!res.locals.user.tipe  <role.value ){
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
module.exports = Object.freeze({
    jwtMiddleware: jwtMiddleware,
    minimumBasic: minimumBasic,
    minimumPro : minimumPro,
    minimumAdmin: minimumAdmin
});