
import Router from "express";
import { AdminController } from "../../controllers/admin/AdminController";

const router = Router();

router.get('/vendor-shops', AdminController.getAllVendorShops);
router.get('/customers', AdminController.getAllCustomers);
router.get('/appointments-earnings/:shopId', AdminController.getAllAppointmentsByShopIdWithEarnings);
router.get("/get-appointments", AdminController.getAllAppointments);



export default router;