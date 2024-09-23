import { asyncHandler } from "../utils/asyncHandler.js"
import {deleteFileFromCloudinary, uploadOnCloudinary} from '../utils/cloudinary.js'
import { User } from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Announcement} from "../models/announcement.model.js"
import {Notification} from "../models/notification.model.js"
import jwt from "jsonwebtoken"
import { sendSuccess } from "../utils/sendSuccess.js"
const generateAccessAndRefreshTokens = async (userId) =>{
    try{
        const user = await User.findById(userId)
        console.log(user)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    }catch(err){
        throw new ApiError(500, 'Something went wrong while generating refresh and access token')
    }
}

class UserController{
    constructor(role='student'){
        this.role = role
    }
    userLogin = asyncHandler(async (req,res)=>{
        const {username, password} = req.body
        console.log(username, password)
        const user = await User.findOne({username})
        if(!user || !(await user.isPasswordCorrect(password)) || user.role!==this.role){
            throw new ApiError(400, "Invalid Credentials")
        }
        //access And Refresh Token 
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
        //send cookie
        const loggedInUser = await User.findById(user._id).select("-profile -username -password -refreshToken")
    
        const options= {
            httpOnly : true,
            secure : true,
        }
    
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {accessToken, refreshToken, loggedInUser}, "User logged In Successfully"))
    })
    userLogout = asyncHandler(async (req, res)=>{
        const userId = req.user._id
        await User.findByIdAndUpdate(
            userId,
            {
                $unset : {
                    refreshToken :""
                }
            },
            {
                new :true
            }
        )
        const options= {
            httpOnly : true,
            secure : true,
        }
        return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User Logged Out"))
    })
    
    refreshAccessToken = asyncHandler(async(req, res) => {
        try {
            const token = req.cookies.refreshToken || req.body.refreshToken
            if(!token)
                throw new ApiError(401, 'Unauthorized Request')
            const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
            const user = await User.findById(decodedToken._id)
            if(!user)
                throw new ApiError(401, 'Invalid Token')
            
            const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)  
            const options= {
                httpOnly : true,
                secure : true,
            }
            return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, {accessToken, refreshToken}, "Access Token Renewed"))
        } catch (error) {
            throw new ApiError(501, "Something went wrong in refreshing Access Token")
        }
    })
    updateAccountInfo = asyncHandler(async (req, res)=>{
        const {fullName, oldPassword, newPassword} = req.body
        if(!fullName){
            throw new ApiError(401, "FullName is required")
        }
        console.log(newPassword)
        console.log(oldPassword)
        if(!newPassword || !oldPassword){
            throw new ApiError(401, "Old and New password are both compulsory")
        }
        const user = await User.findById(req.user?._id)
        const isPasswordCorrect = user.isPasswordCorrect(oldPassword)
        if(!isPasswordCorrect){
            throw new ApiError(400,  "Invalid old Password")
        }
        user.password = newPassword
        user.fullName = fullName
        await user.save({validateBeforeSave: false})
    
        return sendSuccess(200, {}, "Account Info Changed Successfully")
    
    })
    getCurrentUser = asyncHandler(async (req,  res)=>{
        return sendSuccess(res,  req.user,  "Current User Fetched Successfully")
    })
    updateProfileImage = asyncHandler(async(req,  res) => {
        const profileLocalPath =  req.file?.path
        if(!profileLocalPath){
            throw new ApiError(400, "Profile Image file is missing")
        }
        const oldProfileImageUrl = (await User.findById(req.user?._id))?.profile
        const deleteFromCloudinaryResponse = await deleteFileFromCloudinary(oldProfileImageUrl, profileLocalPath)
        console.log(deleteFromCloudinaryResponse)
        const profileImage = await uploadOnCloudinary(profileLocalPath)
        if(!profileImage.url){
            throw new ApiError(500, "Error while Uploading on Profile Image")
        }
        
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    profile : profileImage.url
                }
            },
            {new : true}
        ).select("-profile -username -password -refreshToken")
    
        return sendSuccess(res, user, "Profile Image Updated Successfully")
    
    })
    deleteUserProfileImage = asyncHandler(async (req, res)=>{
        let user = await User.aggregate([
            {
                $match : {
                    _id : req.user?._id
                }
            },
            {
                $project : {
                    profile : 1,
                }
            },
        ])
        const profileImagePath = user[0].profileImage
        const deletedFile = await deleteFileFromCloudinary(profileImagePath)
        console.log(deletedFile)
        user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $unset : {
                    profile : 1,
                }
            },
            {new :  true},
        )
        return sendSuccess(res, user, "Profile Image Deleted Successfully")
    })
    getNotifications = asyncHandler(async (req, res)=> {
        const { userId } = req.user;
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
        return sendSuccess(res, notifications, "Notifications retrieved successfully.");
    })
    readNotification = asyncHandler(async (req, res)=> {
        const { userId } = req.user;
        const {notificationId} = req.body
        const notification = await Notification.findOne({_id : notificationId, user : userId})
        if(!notification)
            throw new ApiError(404, "Notification not found")
        const announcement = await Announcement.findById(notification.announcement)
        if (!announcement) 
            throw new ApiError(404, "Announcement not found")
        await Notification.findByIdAndUpdate(notificationId, {read : true})
        return sendSuccess(res, announcement, "Announcement Fetched")
    })
}

export {UserController}