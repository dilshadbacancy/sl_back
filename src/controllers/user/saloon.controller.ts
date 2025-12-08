import { AppErrors } from "../../errors/app.errors";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { AddServiceToShopSchema, UpdateServiceOfShop } from "../../schema/admin/services";
import { SaloonService } from "../../service/user/saloon.service";
import { ApiResponse } from "../../utils/apiResponse";
import { Request, Response } from "express";

export class SaloonController {

    static async addServicesToShop(req: AuthRequest, res: Response): Promise<void> {

        const parsed = AddServiceToShopSchema.safeParse(req.body);

        if (!parsed.success) {
            ApiResponse.error(parsed.error)
        }

        await SaloonService.addServicesToShop(parsed.data!.shop_id, parsed.data!.services)
            .then((value) => ApiResponse.success("Services added to your shops", value))
            .catch((e) => ApiResponse.error(e));
    }


    static async updateServicesOfShops(req: AuthRequest, res: Response): Promise<void> {
        let parsed: any;

        try {
            parsed = UpdateServiceOfShop.safeParse(req.body);
            if (!parsed.success) {
                ApiResponse.error(parsed.error)
            }
        } catch (e) {
            console.log(e);

        }
        await SaloonService.updateServiceOfShop(parsed.data)
            .then((value) => ApiResponse.success("Service updated successfully", value))
            .catch((e) => ApiResponse.error(e))
    }


    // static async getNearByShops(req: AuthRequest, res: Response): Promise<void> {
    //     const { city, lat, lng, radius = 5 } = req.query;
    //     await SaloonService.getNearByShops(
    //         city?.toString() ?? "",
    //         Number(lat),
    //         Number(lng),
    //         Number(radius)

    //     )
    //         .then((value) => ApiResponse.success("Shops fetched successfully", value))
    //         .catch((e) => ApiResponse.error(e))
    //         .finally(() => res.end())
    // }
}