import Router from "express";
import { AuthController } from "../controllers/auth_controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();


router.post("/send-otp", AuthController.sendOtp);
router.post("/verify-otp", AuthController.verifyOtp)
router.post("/logout", authMiddleware, AuthController.logout)
router.post("/new-access-token", AuthController.generateNewAccessToken)

export default router;