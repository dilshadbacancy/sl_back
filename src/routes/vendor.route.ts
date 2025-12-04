import Router from "express";
import { VendorController } from "../controllers/vendor.controller";

const router = Router();

router.post("/save-vendor-details", VendorController.saveVendorDetails);
router.post("/save-vendor-location", VendorController.saveVendorLocation)

export default router;