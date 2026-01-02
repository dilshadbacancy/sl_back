import { Router, Request, Response, NextFunction } from "express";
import { CommonController } from "../../controllers/common/common.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import { AppErrors } from "../../errors/app.errors";
import { getContext } from "../../utils/request.context";

const router = Router();

// Multer error handler middleware
const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        if (err instanceof AppErrors) {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }
        // Handle multer-specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB',
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message || 'File upload error',
        });
    }
    next();
};

router.use(authMiddleware)
router.put('/update-device-info', CommonController.saveDeviceInfo)
router.get("/device-info", CommonController.getDeviceInfo)
router.post("/save-token", CommonController.saveFCMToken)
router.get("/fcm-token", CommonController.getFCMToken)

router.post("/upload-media", upload.single("file"), handleMulterError, CommonController.uploadMedia)

export default router;