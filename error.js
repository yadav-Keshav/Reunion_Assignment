function createError(){
    const error=new Error(statusCode,message);
    error.status=statusCode;
    error.message=message;
}

module.exports=createError;