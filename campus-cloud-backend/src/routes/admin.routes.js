import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    userLogout,
    userLogin,
    assignCourseToDepartment, 
    changeDepartmentOfTeacher, 
    changeHod, 
    // deleteStudent, 
    endCurrentSemester, 
    getAllCourses, 
    getAllDepartments, 
    getAllTeachers, 
    getCurrentUser, 
    makeDepartment, 
    refreshAccessToken, 
    registerStudent, 
    registerTeacher, 
    updateAccountInfo,
    // adminRegistration,
} from "../controllers/admin.controller.js"

const router = Router()
// router.route('/admin-registration').post(adminRegistration)
router.route('/login').post(userLogin)
router.route('/refresh-token').post(refreshAccessToken)
router.use(verifyJWT)
router.route('/logout').post(userLogout)
router.route('/make-department').post(makeDepartment)
router.route('/change-hod').post(changeHod)
router.route('/register-teacher').post(registerTeacher)
router.route('/assign-course-to-department').post(assignCourseToDepartment)
router.route('/get-all-courses').get(getAllCourses)
router.route('/get-all-teachers').get(getAllTeachers)
router.route('/get-all-departments').get(getAllDepartments)
router.route('/get-current-user').get(getCurrentUser)
router.route('/register-student').post(registerStudent)
router.route('/change-department-of-teacher').post(changeDepartmentOfTeacher)

//not tested
// router.route('/delete-student').post(deleteStudent)
router.route('/end-current-sem').post(endCurrentSemester)
router.route('/update-account-info').post(updateAccountInfo)
export default router