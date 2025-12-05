import Router from "express";
import { barberAuthMiddleware } from "../../middlewares/barbar.auth.middleware";
import { BarberController } from "../../controllers/vendor/barber.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();


/// Baber routes only here........
router.post("/login", BarberController.loginBarber);

router.get("/barber-profile", barberAuthMiddleware, BarberController.getBarberProfile)

router.use(authMiddleware)
router.post("/create-barber", BarberController.createBarber);
router.post("/update-barber", BarberController.updateBarber);

router.get("/barbers/:id", BarberController.getAllBarbersOfShop)
router.post("/availability", BarberController.toggelBarberAvailability);



export default router;