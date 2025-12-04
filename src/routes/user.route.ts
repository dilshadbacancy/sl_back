

import Router from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";

const router = Router()

router.use(authMiddleware)
router.post("/save-profile", UserController.saveUserProfile)
router.post("/update-profile", UserController.updateUserProfile)
router.post("/update-location", UserController.updateUserLocation)
router.get("/user-profile", UserController.getUserProfile);
router.post("/update-status", UserController.updateUserStatus)
router.get("/get-status", UserController.getAllUserStatus);
router.get("/check-profile", UserController.checkProfileCompletion)



export default router;