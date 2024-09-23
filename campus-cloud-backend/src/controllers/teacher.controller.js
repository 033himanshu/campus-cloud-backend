import { Department } from "../models/department.model.js";
import { Teacher } from "../models/teacher.model.js";
import {sendSuccess} from "../utils/sendSuccess.js"
import { Course } from "../models/course.model.js";
import { Class } from "../models/class.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UserController } from "./user.controller.js";
import { Subject } from "../models/subject.model.js";
import { Student } from "../models/student.model.js";
import { Attendence } from "../models/attendence.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {Material} from "../models/material.model.js"
class TeacherController extends UserController{
    constructor(){
        super("teacher")
    }
    isTeacherHoD = asyncHandler(async (req,res)=>{
        const {userId} = req.user
        const department = await Department.findOne({hod : userId})
        const isHoD = (department) ? true : false
        return sendSuccess(res, {isHoD}, "Checked User is HoD or not")
    })
    assignSubjectToCourse = asyncHandler(async (req, res) => {
        const { name, sem, courseId } = req.body;
        const { userId } = req.user;
        // Find course and check if it exists
        const course = await Course.findById(courseId);
        if (!course) {
            throw new ApiError(404, "Course not found");
        }

        // Find the department of the course
        const department = await Department.findById(course.department);
        if (!department) {
            throw new ApiError(404, "Department not found");
        }

        // Check if the current teacher is the HOD of the department
        if (department.hod.toString() !== userId.toString()) {
            throw new ApiError(`Only the HoD of ${department.name} department can assign subjects to this course`);
        }

        // Check if the subject already exists for the course and semester
        const existingSubject = await Subject.findOne({ name, sem, course: courseId });
        if (existingSubject) {
            throw new ApiError(400, "Subject already exists for this course and semester");
        }

        // Create the subject
        const subject = await Subject.create({
            name,
            sem,
            course: courseId,
        });

        return sendSuccess(res, subject, "Subject assigned to course successfully")
        // return res
        //     .status(201)
        //     .json(new ApiResponse(201, subject, "Subject assigned to course successfully"));
    })
    deleteSubjectFromCourse = asyncHandler(async (req, res)=>{
        const { subjectId, courseId } = req.body;
        const { userId } = req.user;

        const course = await Course.findById(courseId);
        if (!course) {
            throw new ApiError(404, "Course not found");
        }

        const department = await Department.findById(course.department);
        if (!department || department.hod.toString() !== userId.toString()) {
            throw new ApiError(403, "Only the HOD can delete subjects");
        }

        const subject = await Subject.findById(subjectId);
        if (!subject || subject.course.toString() != courseId.toString()) {
            throw new ApiError(404, "Subject not found");
        }
        await Subject.findByIdAndDelete(subjectId)
        return sendSuccess(res, {}, "Subject deleted successfully")

    })
    assignTeacherToSubject = asyncHandler(async (req, res)=>{
        // assign teacher to subject who will be taking classes 
        // done by  hod  only
        const { teacherId, subjectId, courseId } = req.body;
        const { userId } = req.user;
        const teacher = await Teacher.findOne({user : teacherId});
        if (!teacher) {
            throw new ApiError(404, "Teacher not found");
        }
        let subject = await Subject.findOne({ _id: subjectId, course: courseId }).populate({
            path: "course",
            select: "department"
        })
        if (!subject) {
            throw new ApiError(404, "Subject not found or does not belong to the specified course.");
        }

        const department = await Department.findById(subject.course.department);
        if(department.hod.toString() !== userId.toString()) {
            throw new ApiError(403, `Only the HoD of ${department.name} department can assign teacher to this subject`);
        }


        const classRef = await Class.create({subject : subject._id, teacher : teacherId});
        return sendSuccess(res, classRef, "Teacher assigned to subject successfully");
    })
    takeAttendence = asyncHandler(async (req, res)=> {
        // this can be handle by any teacher who is taking the class with classId
        // will receive a classId, with studentId array who  are present in class
        // make entry with in attendence 
        // and increment totalClass in class collection
        const { classId, presentStudents } = req.body;
        const {userId} = req.user
        let classRef = await Class.findById(classId);
        if (!classRef) throw new ApiError(404, "Class not found");
        if(classRef.teacher.toString() !== userId.toString())
            throw new ApiError(401, "Only subject teacher can take attendence")
        
        // Record attendance for each student
        for (const studentId of presentStudents) {
            await Attendence.findOneAndUpdate(
                { classRef: classId, student: studentId },
                { $push: { attendence: new Date() } },
                { new: true, upsert: true }
            )
        }

        // Increment totalClass in class collection
        classRef = await Class.findByIdAndUpdate(classId, { $inc: { totalClass: 1 } }, {new : true})

        return sendSuccess(res, classRef, "Attendance recorded successfully");
    })
    uploadMaterial = asyncHandler(async (req, res)=> {
        // upload the files
        const {userId} = req.user
        const { classId, info } = req.body;
        const filePath = req.file?.path;

        if (!classId || !filePath) 
            throw new ApiError(400, "Class ID and files are required");

        const classRef = await Class.findOne({_id : classId, teacher : userId})
        if (!classRef) 
            throw new ApiError(404, "Class not found");

        console.log(filePath)
        const result = await uploadOnCloudinary(filePath)
        if(!result)
            console.log("File not available")
        console.log(result)
        const material = await Material.create({
            classRef: classRef._id,
            file: result?.url || "",
            info,
        })
        return sendSuccess(res, material, "Material uploaded successfully");

    })
    makeAnnouncement = asyncHandler(async (req, res)=> {
        // teacher can make announcements upto different levels
        const { type, subject, data, receiverIds } = req.body;
        const { userId } = req.user;

        const teacher = await Teacher.findOne({ user: userId });
        if (!teacher) throw new ApiError(404, "Teacher not found");

        const announcement = await Announcement.create({
            type,
            owner: teacher._id,
            subject,
            data,
            receiver: receiverIds
        });

        for (const userId of receiverIds) {
            await Notification.create({ user: userId, announcement: announcement._id, type});
        }

        return sendSuccess(res, announcement, "Announcement made successfully");
    })
    getAllCoursesInDepartment = asyncHandler(async (req, res)=>{
        // can accessed by hod  only
        const {userId}  = req.user
        const department = await Department.findOne({hod : userId})
        if(!department)
            throw new ApiError(401, "HoD not found")
        const courses = await Course.find({department : department._id})
        return sendSuccess(res, courses, "Coursed retrived")
    })
    getAllTeachersInDepartment = asyncHandler(async (req, res)=>{
        // can accessed by hod  only
        const {userId}  = req.user
        const department = await Department.findOne({hod : userId})
        if(!department)
            throw new ApiError(401, "HoD not found")
        const teachers = await Teacher.find({department : department._id})
        return sendSuccess(res, teachers, "Coursed retrived")
    })
    // getAllStudentsInDepartment = asyncHandler(async (req, res)=>{
    //     // can accessed by hod  only

    // })
    getAllSubjectInCourse = asyncHandler(async (req, res)=>{
        // can accessed by hod  only
        const {userId} = req.user
        const {courseId} = req.body
        const department = await Department.findOne({hod : userId})
        if(!department)
            throw new ApiError(401, "HoD not found")
        const course  = await Course.findById(courseId)
        if(!course || course.deparment.toString() !== userId.toString())
            throw new ApiError(401, `course not exist in ${department.name} department`)

        const subjects = Subject.find({course : courseId})
        return sendSuccess(res, subjects, "Subjects retreived")
    })
    getAllStudentInClass = asyncHandler(async (req, res)=>{
        // handle by teacher who is taking that class
        const {userId} = req.user
        const {classId} = req.body
        const classRef = await Class.findById(classId).populate("subject")
        if(!classRef || classRef.teacher.toString() !== userId.toString())
            throw new ApiError(401, "class not exist or user not take this class")
        
        const students = await Student.find({sem : classRef.subject.sem, course: classRef.subject.course})
        
        return sendSuccess(res, students, "Students Fetched")
    })
    getAllMaterial = asyncHandler(async (req, res)=>{
        const {classRef} = req.body
        const {userId} = req.user

        const classExists = await Class.findOne({ _id: classRef, teacher:userId})
        if(!classExists)
            throw new ApiError(403, "Not Accessible")

        const material = await Material.find({classRef}).sort({createdAt : -1})

        return sendSuccess(res, material, "Material fetched")
    })
}
const teacherController = new TeacherController()


export const {
    assignSubjectToCourse,
    deleteSubjectFromCourse,
    assignTeacherToSubject,
    takeAttendence,
    uploadMaterial,
    makeAnnouncement,
    getAllCoursesInDepartment,
    getAllTeachersInDepartment,
    getAllSubjectInCourse,
    getAllStudentInClass,
    getAllMaterial,
    userLogin,
    userLogout,
    refreshAccessToken,
    updateAccountInfo,
    getCurrentUser,
    updateProfileImage,
    deleteUserProfileImage,
    getNotifications,
    readNotification,
    isTeacherHoD,
} = teacherController;