
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import { ShopServices } from "../../service/vendor/shop.service";
import { CreateSaloonShopSchema, ShopBankDetailsSchema, ShopKycDetailSchema, ShopLoactionSchema } from "../../schema/vendor/shop.schema";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { CreateServiceSchema, AddServiceToShopSchema, UpdateServiceOfShop } from "../../schema/vendor/services.schema";


export class ShopController {
    static async saveSaloonShop(req: AuthRequest, res: Response): Promise<void> {
        const parsed = CreateSaloonShopSchema.safeParse(req.body);

        if (!parsed.success) {
            return ApiResponse.error(parsed.error);
        }
        await ShopServices.saveSaloonShop(parsed.data)
            .then((value) => ApiResponse.success("Shop details saved successfully", value))
            .catch((e) => ApiResponse.error(e));
    }

    static async saveSaloonShopLocation(req: AuthRequest, res: Response): Promise<void> {
        const parsed = ShopLoactionSchema.safeParse(req.body);

        if (!parsed.success) {
            return ApiResponse.error(parsed.error);
        }

        await ShopServices.saveSaloonShopLocation(parsed.data)
            .then((value) => ApiResponse.success("Vendor location saved successfully", value))
            .catch((e) => ApiResponse.error(e))
    }

    static async saveSaloonShopKyc(req: AuthRequest, res: Response): Promise<void> {
        const parsed = ShopKycDetailSchema.safeParse(req.body);

        if (!parsed.success) {
            return ApiResponse.error(parsed.error);
        }

        await ShopServices.saveSaloonShopKyc(parsed.data)
            .then((value) => ApiResponse.success("Vendor KYC details saved successfully", value))
            .catch((e) => ApiResponse.error(e))
    }

    static async saveSaloonShopBankDetails(req: AuthRequest, res: Response): Promise<void> {
        const parsed = ShopBankDetailsSchema.safeParse(req.body);

        if (!parsed.success) {
            return ApiResponse.error(parsed.error);
        }

        await ShopServices.saveSaloonShopBankDetails(parsed.data)
            .then((value) => ApiResponse.success("Vendor Bank details saved successfully", value))
            .catch((e) => ApiResponse.error(e))
    }


    static async getShopProfile(req: AuthRequest, res: Response): Promise<void> {
        const id = req.user?.id;
        if (!id) {
            return ApiResponse.error("User ID is required", 400);
        }
        await ShopServices.getShopProfile(id)
            .then((value) => ApiResponse.success("Vendor fetched successfully", value))
            .catch((e) => ApiResponse.error(e))
    }



    static async createService(req: Request, res: Response): Promise<void> {
        const parsed = CreateServiceSchema.safeParse(req.body);
        if (!parsed.success) {
            return ApiResponse.error(parsed.error);
        }

        await ShopServices.createServices(parsed.data)
            .then((value) => ApiResponse.success("Service created successfully", value))
            .catch((e) => ApiResponse.error(e))
    }


    static async getAllServices(req: Request, res: Response): Promise<void> {
        await ShopServices.getAllServices()
            .then((value) => ApiResponse.success("Service fetched successfully", value))
            .catch((e) => ApiResponse.error(e))
    }

    // Shop Services Management (previously in saloon)
    static async addServicesToShop(req: AuthRequest, res: Response): Promise<void> {
        const parsed = AddServiceToShopSchema.safeParse(req.body);

        if (!parsed.success) {
            return ApiResponse.error(parsed.error);
        }

        await ShopServices.addServicesToShop(parsed.data!.shop_id, parsed.data!.services)
            .then((value) => ApiResponse.success("Services added to your shops", value))
            .catch((e) => ApiResponse.error(e));
    }

    static async updateServicesOfShops(req: AuthRequest, res: Response): Promise<void> {
        const parsed = UpdateServiceOfShop.safeParse(req.body);

        if (!parsed.success) {
            return ApiResponse.error(parsed.error);
        }

        await ShopServices.updateServiceOfShop(parsed.data)
            .then((value) => ApiResponse.success("Service updated successfully", value))
            .catch((e) => ApiResponse.error(e));
    }
}