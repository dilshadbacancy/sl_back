import { Router } from "express";
import { UserAdminController } from "../../controllers/admin/UserAdminController";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);
router.get("/profile", UserAdminController.getUserAdminProfile);
router.put("/update-profile", UserAdminController.updateUserAdminProfile);

export default router;