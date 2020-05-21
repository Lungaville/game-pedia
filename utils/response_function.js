let httpCode= require('./http-code')

var responseNotFound = (res,message) =>{
    return res.status(httpCode.NOT_FOUND).json({
        'status' : 'NOT_FOUND',
        'message' : message
    })
}
var duplicateResponseCode = (res,message) =>{
    return res.status(httpCode.DUPLICATE).json({
        'status' : 'DUPLICATE',
        'message' : message
    })
}
var insertResponseCode = (res,message,data) =>{
    return res.status(httpCode.SUCCESS_INSERT).json({
        'status' : 'CREATED',
        'message' : message,
        'data' : data
    })
}
var deleteResponseCode = (res,message) =>{
    return res.status(httpCode.OK).json({
        'status' : 'OK',
        'message' : message
    })
}
var getResponse = (res,message,data) =>{
    return res.status(httpCode.OK).json({
        'status' : 'OK',
        'message' : message,
        'data' : data
    })
}
var unexpectedError = (res,message) =>{
    return res.status(httpCode.BAD_REQUEST).json({
        'status' : 'BAD_REQUEST',
        'message' : message
    })
}

module.exports = Object.freeze({
    notFound: responseNotFound,
    duplicate : duplicateResponseCode,
    insert: insertResponseCode,
    delete : deleteResponseCode,
    unexpectedError : unexpectedError,
    get : getResponse
});