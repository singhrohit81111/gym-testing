const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const jwt=require('jsonwebtoken');

const verifyJWT=asyncHandler(async(req,res,next)=>{
    const refreshToken=req.cookies?.accessToken;
    
    if(!refreshToken){
        throw new ApiError(401,"Invalid request");
    }
    const decodedToken=await jwt.verifyJWT(refreshToken,process.env.ACCESS_TOKEN);
    const user=await User.findById(decodedToken._id).select("-password -refreshToken");
    if(!user){
        throw new ApiError(401,"Invalid Token");
    }
      req.user=user;
    next();
})