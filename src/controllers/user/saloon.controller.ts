import { AuthRequest } from "../../middlewares/auth.middleware";
import { SaloonService } from "../../service/user/saloon.service";
import { ApiResponse } from "../../utils/apiResponse";
import { Request, Response } from "express";

export class SaloonController {
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