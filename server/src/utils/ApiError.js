class ApiError extends Error{
    constructor(statusCode,message,errors=[],stack=""){
        super();
        this.message=message;
        this.statusCode=statusCode;
        this.errors=errors;
        this.success=false;
        if(stack){
            this.stack=stack;
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

module.exports=ApiError;



