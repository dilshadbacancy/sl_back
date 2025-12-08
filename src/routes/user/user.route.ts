

import Router from "express";
import { UserController } from "../../controllers/user/user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { User } from "../../models/user/user.model";

const router = Router()

router.use(authMiddleware)
router.post("/save-profile", UserController.saveUserProfile)
router.post("/update-profile", UserController.updateUserProfile)
router.post("/update-location", UserController.updateUserLocation)
router.get("/user-profile", UserController.getUserProfile);
router.post("/update-status", UserController.updateUserStatus)
router.get("/get-status", UserController.getAllUserStatus);
router.get("/get-genders", UserController.getAllGenders);
router.get("/roles", UserController.getAllRoles)
router.get("/check-profile", UserController.checkProfileCompletion)



export default router;