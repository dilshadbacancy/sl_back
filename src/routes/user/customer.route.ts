import { Router } from "express";
import { CustomerController } from "../../controllers/user/customer.controller";

const router = Router()


router.get("/near-by-shops", CustomerController.fetchNearByShops)


router.post("/book-appointment", CustomerController.bookAppointment);

router.put("/assign-appointments", CustomerController.assignAppointments);

router.get("/appointments", CustomerController.getAllAppoitments)
router.put("/change-appointment-status", CustomerController.changeAppointmentStatus);

router.get("/payment-modes", CustomerController.getPaymentsModes);
router.get("/appointment-statuses", CustomerController.getAppointmentsStatus);

router.get("/categories", CustomerController.getAllCategory);


export default router;// test change
