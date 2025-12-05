import Router from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
const router = Router();


router.use(authMiddleware)
// router.get("/shops", SaloonController.getNearByShops)

export default router;