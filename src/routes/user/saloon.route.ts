import Router from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { SaloonController } from "../../controllers/user/saloon.controller";
const router = Router();


router.use(authMiddleware)
router.post("/add-services", SaloonController.addServicesToShop)

export default router;