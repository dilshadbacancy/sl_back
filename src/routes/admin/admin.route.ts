
import Router from "express";
import { AdminController } from "../../controllers/admin/AdminController";

const router = Router();

router.get('/vendor-shops', AdminController.getAllVendorShops);
router.get('/customers', AdminController.getAllCustomers);
router.get("/get-appointments", AdminController.getAllAppointments);
router.get("/vendor-shops/:id", AdminController.getShopDetailById)



export default router;