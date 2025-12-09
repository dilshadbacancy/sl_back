import { Router } from "express";
import { CustomerController } from "../../controllers/user/customer.controller";

const router = Router()


router.get("/near-by-shops", CustomerController.fetchNearByShops)


router.post("/book-appointment", CustomerController.bookAppointment);

router.post("/assign-appointments", CustomerController.assignAppointments);

router.get("/appointments", CustomerController.getAllAppoitments)
router.post("/change-appointment-status", CustomerController.changeAppointmentStatus);


export default router;