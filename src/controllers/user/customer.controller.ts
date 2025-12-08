import { AuthRequest } from "../../middlewares/auth.middleware";
import { NearByShops } from "../../schema/user/customer.schema";
import { CustomerServies } from "../../service/user/customer.service";
import { ApiResponse } from "../../utils/apiResponse";
import { Response } from "express";

export class CustomerController {

    static async fetchNearByShops(req: AuthRequest, res: Response): Promise<void> {

        const parsed = NearByShops.safeParse(req.body);

        if (!parsed.success) {
            ApiResponse.error(parsed.error)
        }

        await CustomerServies.fetchNearByShops(parsed.data)
            .then((value) => ApiResponse.success("All available near by shops fetched..", value))
            .catch((e) => ApiResponse.error(e))


    }


}