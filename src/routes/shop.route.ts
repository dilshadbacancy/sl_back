import Router from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ShopController } from "../controllers/vendor/shop.controller";
import { BarberController } from "../controllers/vendor/barber.controller";
import { barberAuthMiddleware } from "../middlewares/barbar.auth.middleware";

const router = Router();


/// Baber routes only here........
router.post("/login", BarberController.loginBarber);

router.get("/barber-profile", barberAuthMiddleware, BarberController.getBarberProfile)

router.use(authMiddleware)
router.post("/save-shop-details", ShopController.saveSaloonShop);
router.post("/save-shop-location", ShopController.saveSaloonShopLocation)
router.post("/save-shop-kyc", ShopController.saveSaloonShopKyc)
router.post("/save-shop-bank", ShopController.saveSaloonShopBankDetails)

router.get("/get-shop-profile", ShopController.getShopProfile);

router.post("/add-barber", BarberController.addBarber);
router.post("/update-barber", BarberController.updateBarber);

router.get("/barbers/:id", BarberController.getAllBarbersOfShop)
router.post("/availability", BarberController.toggelBarberAvailability);



export default router;