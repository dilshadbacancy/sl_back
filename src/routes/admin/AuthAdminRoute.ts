import { Router } from "express"
import { AuthAdminController } from "../../controllers/admin/AuthAdminController"
import { authMiddleware } from "../../middlewares/auth.middleware"

const router = Router()

// Base path: /auth
router.post("/register", AuthAdminController.registerAdmin)
router.post("/login", AuthAdminController.loginAdmin)

router.post("/change-password", AuthAdminController.changeAdminPassword);
router.post("/logout-admin", authMiddleware, AuthAdminController.logoutAdminUser);
router.get("/access-token", AuthAdminController.getNewAccessToken)
router.post("/send-otp", AuthAdminController.sendOtpForForgetPassword);
router.post("/verify-reset-password", AuthAdminController.verifyOtpAndResetPassword)

export default router
