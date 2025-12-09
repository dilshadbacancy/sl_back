import Router from "express";
import { barberAuthMiddleware } from "../../middlewares/barbar.auth.middleware";
import { BarberController } from "../../controllers/vendor/barber.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { ShopController } from "../../controllers/vendor/shop.controller";

const router = Router();


router.use(authMiddleware)
router.post("/save-shop-details", ShopController.saveSaloonShop);
router.post("/save-shop-location", ShopController.saveSaloonShopLocation)
router.post("/save-shop-kyc", ShopController.saveSaloonShopKyc)
router.post("/save-shop-bank", ShopController.saveSaloonShopBankDetails)

router.get("/get-shop-profile", ShopController.getShopProfile);


router.post("/create-service", ShopController.createService)
router.get("/services", ShopController.getAllServices)




export default router;