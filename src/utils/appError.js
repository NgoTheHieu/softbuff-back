class AppError extends Error{
    constructor(statusCode, message){
        super(message)
        this.statusCode = statusCode || 500
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error" 

        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}

const catchAsync = func => {
    return (req,res,next) => func(req,res,next).catch(next)
}

module.exports = {
    catchAsync, AppError
}