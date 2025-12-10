import Router from "express";
import multer from "multer";
import { CommonController } from "../../controllers/common/commoon.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  }
});

router.use(authMiddleware)
router.post('/update-device-info', CommonController.saveDeviceInfo)
router.get("/device-info", CommonController.getDeviceInfo)
router.post("/save-token", CommonController.saveFCMToken)
router.get("/fcm-token", CommonController.getFCMToken)
router.post("/upload-image", upload.single('image'), CommonController.uploadImage)

export default router;