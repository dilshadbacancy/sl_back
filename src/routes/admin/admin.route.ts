
import Router from "express";
import { AdminController } from "../../controllers/admin/admin.controller";

const router = Router();


router.post("/create-service", AdminController.createService)
router.get("/services", AdminController.getAllServices)

export default router;