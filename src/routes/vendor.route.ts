import Router from "express";
import { VendorController } from "../controllers/vendor.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { VendorService } from "../service/vendor.service";

const router = Router();

router.use(authMiddleware)
router.post("/save-vendor-details", VendorController.saveVendorDetails);
router.post("/save-vendor-location", VendorController.saveVendorLocation)
router.post("/save-vendor-services", VendorController.saveVendorServices)
router.post("/save-vendor-kyc", VendorController.saveVendorKycDetails)
router.post("/save-vendor-bank", VendorController.saveVendorBankDetails)

router.get("/get-vendors", VendorController.getVendors);

export default router;