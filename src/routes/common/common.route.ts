import Router from "express";
import { CommonController } from "../../controllers/common/commoon.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();



router.use(authMiddleware)
router.post('/update-device-info', CommonController.saveDeviceInfo)
router.get("/device-info", CommonController.getDeviceInfo)
router.post("/save-token", CommonController.saveFCMToken)
router.get("/fcm-token", CommonController.getFCMToken)

export default router;