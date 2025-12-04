import Router from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { VendorService } from "../service/vendor/vendor.service";
import { VendorController } from "../controllers/vendor/vendor.controller";
import { BarberController } from "../controllers/vendor/barber.controller";
import { barberAuthMiddleware } from "../middlewares/barbar.auth.middleware";

const router = Router();


/// Baber routes only here........
router.post("/login", BarberController.loginBarber);

router.get("/barber-profile", barberAuthMiddleware, BarberController.getBarberProfile)

router.use(authMiddleware)
router.post("/save-vendor-details", VendorController.saveVendorDetails);
router.post("/save-vendor-location", VendorController.saveVendorLocation)
router.post("/save-vendor-services", VendorController.saveVendorServices)
router.post("/save-vendor-kyc", VendorController.saveVendorKycDetails)
router.post("/save-vendor-bank", VendorController.saveVendorBankDetails)

router.get("/get-vendors", VendorController.getVendors);

router.post("/add-barber", BarberController.addBarber);
router.post("/update-barber", BarberController.updateBarber);

router.get("/barbers/:id", BarberController.getAllBarbersOfShop)
router.post("/availability", BarberController.toggelBarberAvailability);



export default router;