import { Router } from "express";
import { CustomerController } from "../../controllers/user/customer.controller";

const router = Router()


router.get("/near-by-shops", CustomerController.fetchNearByShops)


export default router;