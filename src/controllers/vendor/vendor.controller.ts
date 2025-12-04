
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import { VendorService } from "../../service/vendor/vendor.service";
import { VendorBankDetailSchema, VendorKYCDetailsSchema, VendorLocationDetailsSchema, VendorServicesUpdateSchema, VendorShopDetailsSchema } from "../../schema/vendor/vendor_schema";
import { AuthRequest } from "../../middlewares/auth.middleware";


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


    static async saveVendorServices(req: AuthRequest, res: Response): Promise<any> {

        const parsed = VendorServicesUpdateSchema.safeParse(req.body);

        if (!parsed.success) {
            ApiResponse.error(parsed.error);
        }

        await VendorService.saveVendorServices(parsed.data)
            .then((value) => ApiResponse.success("Vendor servicess saved successfully", value))
            .catch((e) => ApiResponse.error(e))
            .finally(() => res.end())

    }

    static async saveVendorKycDetails(req: AuthRequest, res: Response): Promise<void> {

        const parsed = VendorKYCDetailsSchema.safeParse(req.body);

        if (!parsed.success) {
            ApiResponse.error(parsed.error);
        }

        await VendorService.saveVendorKYCDetails(parsed.data)
            .then((value) => ApiResponse.success("Vendor KYC details saved successfully", value))
            .catch((e) => ApiResponse.error(e))
            .finally(() => res.end())
    }

    static async saveVendorBankDetails(req: AuthRequest, res: Response): Promise<any> {
        const parsed = VendorBankDetailSchema.safeParse(req.body);

        if (!parsed.success) {
            ApiResponse.error(parsed.error);
        }

        await VendorService.saveVendorBankDetail(parsed.data)
            .then((value) => ApiResponse.success("Vendor Bank details saved successfully", value))
            .catch((e) => ApiResponse.error(e))
            .finally(() => res.end())
    }


    static async getVendors(req: AuthRequest, res: Response): Promise<void> {
        const id = req.user?.id;
        await VendorService.getVendors(id!)
            .then((value) => ApiResponse.success("Vendor fetched successfully", value))
            .catch((e) => ApiResponse.error(e))
            .finally(() => res.end())
    }
}