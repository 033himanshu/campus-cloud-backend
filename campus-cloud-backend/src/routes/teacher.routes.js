import {Router} from "express"
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()

import {
    isTeacherHoD,
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
    userLogin,
    userLogout,
    refreshAccessToken,
    updateAccountInfo,
    getCurrentUser,
    updateProfileImage,
    deleteUserProfileImage,
    getNotifications,
    readNotification,
    getAllMaterial,
} from "../controllers/teacher.controller.js"

router.route('/login').post(userLogin)
router.route('/logout').post(userLogout)

router.route('/refresh-token').post(refreshAccessToken)
router.use(verifyJWT)

router.route('/is-teacher-hod').get(isTeacherHoD)
router.route('/delete-subject-from-course').delete(deleteSubjectFromCourse)
router.route('/assign-subject-to-course').post(assignSubjectToCourse)
router.route('/assign-teacher-to-subject').post(assignTeacherToSubject)
router.route('/take-attendence').post(takeAttendence)
router.route('/upload-material').post(
    upload.single("material"),
    uploadMaterial
)
router.route('/get-current-user').get(getCurrentUser)
router.route('/get-all-material').get(getAllMaterial)
router.route('/get-all-student-in-class').get(getAllStudentInClass)



router.route('/make-announcement').post(makeAnnouncement)
router.route('/update-account-info').patch(updateAccountInfo)
router.route('/update-profile-Image').patch(
    upload.single("profile"),
    updateProfileImage
)
router.route('/delete-user-profile-image').patch(deleteUserProfileImage)
router.route('/get-all-course-in-department').get(getAllCoursesInDepartment)
router.route('/get-all-subject-in-course').get(getAllSubjectInCourse)
router.route('/get-all-teachers-in-department').get(getAllTeachersInDepartment)
router.route('/get-notifications').get(getNotifications)
router.route('/read-notification').post(readNotification)



export default router