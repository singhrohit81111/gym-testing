const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const { OPTIONS } = require('../constants');

const generateAccesAndRefreshToken = async (user) => {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.save({ validateBeforeUpdate: false });
    return { accessToken, refreshToken };
}

const register = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const userExisted = await User.findOne({ email });
    if (userExisted) {
        throw new ApiError(500, "User already existed! Please login");
    }
    const user = await User.create({
        email: email,
        password: password
    });
    const createdUser = await User.findOne({ _id: user._id }).select("-password -refreshToken");
    res.status(201).json({ createdUser });
})
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if ((!email || !password)) {
        throw new ApiError(500, "All fields are required");
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new ApiError(500, "No user registeed with this email! Kindly register");
    }
    const isPasswordMatching = await existingUser.isPasswordCorrect(password);
    if (!isPasswordMatching) {
        throw new ApiError(501, "Password doesnot match! Re-Enter password");
    }
    const { accessToken, refreshToken } = await generateAccesAndRefreshToken(existingUser);
    res.status(200).cookie("accessToken", accessToken, OPTIONS).cookie("refreshToken", refreshToken, OPTIONS).json({ accessToken, refreshToken });

})

const refreshAccesToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN);
    const user = await User.findById(decodedRefreshToken._id);
    if (!user) {
        throw new ApiError(401, "Unauthorized request");
    }
    const { refreshToken, accessToken } = await generateAccesAndRefreshToken(user);
    res.status(200).cookie("accessToken", accessToken, OPTIONS).cookie("refreshToken", refreshToken, OPTIONS).json({ accessToken, refreshToken });
})

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 }
    });
    res.json(200).clearCookie("accessToken", OPTIONS).clearCookie("refreshToken", OPTIONS);
})
const getUser=asyncHandler(async(req,res)=>{
    const user=User.findById(req.user._id);
    res.status(200).json(user);
})

module.exports = { login, register, refreshAccesToken, refreshAccesToken, logout };