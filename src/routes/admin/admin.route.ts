
import Router from "express";
import { AdminController } from "../../controllers/admin/admin.controller";

const router = Router();

router.get('/vendors', AdminController.getAllVendors);
router.get('/customers', AdminController.getAllCustomers);
router.get('/appointments-earnings/:shopId', AdminController.getAllAppointmentsByShopIdWithEarnings);



export default router;