import { Attendence } from "../models/attendence.model.js"
import { Material } from "../models/material.model.js"
import { Student } from "../models/student.model.js"
import { Subject } from "../models/subject.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { sendSuccess } from "../utils/sendSuccess.js"
import {UserController} from "./user.controller.js"
class StudentController extends UserController{
    constructor(){
        super("student")
    }
    getAssignedSubjects = asyncHandler(async (req, res)=> {
        const {userId} = req.user
        const user = await Student.findOne({user : userId})
        const classes = await Subject.find({sem : user.sem, course : user.course}).populate("class")
        return sendSuccess(res, classes, "Student Subjects Fetched")
    })
    getClassMaterial = asyncHandler(async (req, res)=> {
        const {classRef} = req.body
        const {userId} = req.user

        const classExists = await Attendence.findOne({classRef, student:userId})
        if(!classExists)
            throw new ApiError(403, "Not enrolled in this subject")

        const material = await Material.find({classRef}).sort({createdAt : -1})

        return sendSuccess(res, material, "Material fetched")
    }) 
    getAttendenceInSubject = asyncHandler(async (req, res)=>{
        const {userId} = req.user
        const {classRef}= req.body
        const attendence = await Attendence.findOne({classRef, student : userId}).select("attendence")
        return sendSuccess(res, attendence, "Attendence retrieved")
    })
}

const studentController = new StudentController()

export const {
    getAssignedSubjects,
    getClassMaterial,
    getAttendenceInSubject,
    userLogin,
    userLogout,
    refreshAccessToken,
    updateAccountInfo,
    getCurrentUser,
    updateProfileImage,
    deleteUserProfileImage,
    getNotifications,
    readNotification,
} = studentController