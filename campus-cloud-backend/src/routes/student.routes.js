import {Router} from "express"
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()

import {
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
} from "../controllers/student.controller.js"

router.route('/user-login').post(userLogin)
router.route('/refresh-access-token').post(refreshAccessToken)
router.use(verifyJWT)
router.route('/user-logout').post(userLogout)
router.route('/update-account-info').patch(updateAccountInfo)
router.route('/update-profile-Image').patch(
    upload.single("profile"),
    updateProfileImage
)
router.route('/delete-user-profile-image').patch(deleteUserProfileImage)
router.route('/get-current-user').get(getCurrentUser)
router.route('/get-notifications').get(getNotifications)
router.route('/read-notification').post(readNotification)
router.route('/get-assigned-subjects').get(getAssignedSubjects)
router.route('/get-class-material').get(getClassMaterial)
router.route('get-attendence-in-subject').get(getAttendenceInSubject)

export default router