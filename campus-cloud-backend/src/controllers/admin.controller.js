import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { UserController } from "./user.controller.js";
import { Department } from "../models/department.model.js";
import { sendSuccess } from "../utils/sendSuccess.js";
import { Teacher } from "../models/teacher.model.js";
import { Course } from "../models/course.model.js";
import { Student } from "../models/student.model.js";
import { Admin } from "../models/admin.model.js";

class AdminController extends UserController {
    constructor() {
        super("admin");
    }

    // Helper function to check admin role
    checkAdminRole(req) {
        if (req.user?.role !== 'admin') {
            throw new ApiError(403, "Not eligible to perform this action");
        }
    }

    

    // Create a new department
    makeDepartment = asyncHandler(async (req, res) => {
        this.checkAdminRole(req);

        const { name } = req.body;
        let department = await Department.findOne({ name });
        if (department) {
            throw new ApiError(400, "Department already exists");
        }

        department = await Department.create({ name });
        return sendSuccess(res, department, "Department created successfully");
    });

    // Change HOD of a department
    changeHod = asyncHandler(async (req, res) => {
        this.checkAdminRole(req);

        const { teacherId, deptId } = req.body;

        const teacher = await Teacher.findOne({user : teacherId, department : deptId})
        if (!teacher) {
            throw new ApiError(404, "Teacher not found");
        }

        const department = await Department.findByIdAndUpdate(
            deptId,
            { hod: teacher.user },
            { new: true }
        );
        if (!department) {
            throw new ApiError(404, "Department not found");
        }

        return sendSuccess(res, department, "Department HOD updated");
    });

    // Register a new teacher
    registerTeacher = asyncHandler(async (req, res) => {
        this.checkAdminRole(req);

        const { fullName, username, deptId } = req.body;
        const password = `${username}@123`;
        const role = "teacher";
        console.log(fullName, username, deptId)
        const department = await Department.findById(deptId);
        if (!department) {
            throw new ApiError(404, "Department not found");
        }
        console.log(department)
        const user = await User.create({ fullName, username, password, role });
        const teacher = await Teacher.create({
            user: user._id,
            department: department._id,
        })

        return sendSuccess(res, teacher, "Teacher registered successfully");
    });

    // Change the department of a teacher
    changeDepartmentOfTeacher = asyncHandler(async (req, res) => {
        this.checkAdminRole(req);

        const { teacherId, deptId } = req.body;

        const department = await Department.findById(deptId);
        if (!department) {
            throw new ApiError(404, "Department not found");
        }
        let teacher = await Teacher.findOne({user : teacherId})
        if (!teacher) {
            throw new ApiError(404, "Teacher not found");
        }
        teacher = await Teacher.findByIdAndUpdate(
            teacher._id,
            { department: deptId },
            { new: true }
        );

        return sendSuccess(res, teacher, "Teacher's department updated");
    });

    // Assign a course to a department
    assignCourseToDepartment = asyncHandler(async (req, res) => {
        this.checkAdminRole(req);

        const { name, maximumSemester, deptId } = req.body;
        console.log(name, maximumSemester,deptId)
        const department = await Department.findById(deptId);
        if (!department) {
            throw new ApiError(404, "Department not found");
        }

        const course = await Course.create({
            name,
            maximumSemester,
            department: deptId,
        });

        return sendSuccess(res, course, "Course assigned to department");
    });

    // Register a new student
    registerStudent = asyncHandler(async (req, res) => {
        this.checkAdminRole(req);

        const { fullName, rollno, courseId } = req.body;
        const sem = req.body.sem ? req.body.sem :  1
        const password = `${rollno}@123`;
        const role = "student";
        const course = await Course.findById(courseId);
        if (!course) {
            throw new ApiError(404, "Course not found");
        }
        if(sem>course.maximumSemester)
            throw new ApiError(404, `sem should be <= ${course.maximumSemester}`)
        console.log(fullName, rollno, sem, courseId, password)
        const existingUser = await User.findOne({ username: rollno });
        if (existingUser) {
            throw new ApiError(400, "User with this roll number already exists");
        }
        const user = await User.create({ fullName, username: rollno, password, role })
        console.log(user)
        const student = await Student.create({user: user._id, course: course._id, sem, rollno})

        return sendSuccess(res, student, "Student registered successfully");
    });

    // Placeholder for deleting a student
    // deleteStudent = asyncHandler(async (req, res) => {
    //     this.checkAdminRole(req);

    //     const { studentId } = req.body;

    //     const student = await Student.findByIdAndDelete(studentId);
    //     if (!student) {
    //         throw new ApiError(404, "Student not found");
    //     }
    //     return sendSuccess(res, {}, "Student deleted successfully");
    // });

    // Placeholder for ending the current semester
    endCurrentSemester = asyncHandler(async (req, res) => {
        this.checkAdminRole(req);

        // TODO: Implement logic to handle end of semester tasks
        throw new ApiError(501, "End semester functionality not implemented yet");
    });
    getAllDepartments = asyncHandler(async (req, res)=> {
        this.checkAdminRole(req);
        const departments = await Department.find({});
        return sendSuccess(res, departments, "All departments retrieved");
    }) 
    getAllTeachers = asyncHandler(async (req, res)=> {
        this.checkAdminRole(req);
        const teachers = await Teacher.find({}).populate('user department');
        return sendSuccess(res, teachers, "All teachers retrieved");
    }) 
    getAllCourses = asyncHandler(async (req, res)=> {
        this.checkAdminRole(req);
        const courses = await Course.find({}).populate('department');
        return sendSuccess(res, courses, "All courses retrieved");
    })
    // adminRegistration= asyncHandler(async (req,res)=>{
    //     const {username, password, fullName} = req.body
    //     const role = "admin"
    //     const user = await User.create({ fullName, username, password, role })
    //     return sendSuccess(res, user, "Registraion Successfull")
    // })
}

// Export controller instance and specific methods
const adminController = new AdminController();
export const {
    makeDepartment,
    changeHod,
    registerTeacher,
    changeDepartmentOfTeacher,
    assignCourseToDepartment,
    registerStudent,
    // deleteStudent,
    endCurrentSemester,
    getAllCourses,
    getAllDepartments,
    getAllTeachers,
    userLogin,
    userLogout,
    refreshAccessToken,
    updateAccountInfo,
    getCurrentUser,
    // adminRegistration,
} = adminController;
