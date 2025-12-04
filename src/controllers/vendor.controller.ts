import { AuthRequest } from "../middlewares/auth.middleware";
import { Request, Response } from "express";
import { VendorLocationDetailsSchema, VendorShopDetailsSchema } from "../schema/vendor/vendor_schema";
import { ApiResponse } from "../utils/apiResponse";
import { VendorService } from "../service/vendor.service";

export class VendorController {
    static async saveVendorDetails(req: AuthRequest, res: Response) {
        const parsed = VendorShopDetailsSchema.safeParse(req.body);

        if (!parsed.success) {
            ApiResponse.error(parsed.error);
        }
        await VendorService.saveVendorShopDetails(parsed.data)
            .then((value) => ApiResponse.success(value))
            .catch((e) => ApiResponse.error(e));
    }

    static async saveVendorLocation(req: AuthRequest, res: Response): Promise<any> {

        const parsed = VendorLocationDetailsSchema.safeParse(req.body);

        if (!parsed.success) {
            ApiResponse.error(parsed.error);
        }

        await VendorService.saveVendorLocationDetails(parsed.data)
            .then((value) => ApiResponse.success("Vendor location saved successfully", value))

    }

}