
import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { BarberAvailabilitySchema, BarberSchema } from "../../schema/vendor/barber.schema";
import { ApiResponse } from "../../utils/apiResponse";
import { BarberService } from "../../service/vendor/barber.service";
import { BarberAuthReq as BarberAuthRequest } from "../../middlewares/barbar.auth.middleware";

export class BarberController {


    /// Barber Only-------

    static async loginBarber(req: Request, res: Response): Promise<void> {
        const { username, login_pin } = req.body;
        await BarberService.loginBarber(username, login_pin)
            .then((value) => ApiResponse.success("Login successfully", value))
            .catch((e) => ApiResponse.error(e))
            .finally(() => res.end())
    }

    static async getBarberProfile(req: BarberAuthRequest, res: Response): Promise<void> {
        const id = req.barber?.id;
        await BarberService.getBarbersProfile(id!)
            .then((value) => ApiResponse.success("Barber profile fetched", value))
            .catch((e) => ApiResponse.error(e))
            .finally(() => res.end())
    }




    /// Vendor and Barbar inter relateed

    static async createBarber(req: AuthRequest, res: Response): Promise<any> {

        const parsed = BarberSchema.safeParse(req.body);

        if (!parsed.success) {
            ApiResponse.error(parsed.error);
        }

        await BarberService.createBarber(parsed.data)
            .then((value) => ApiResponse.success("Barber added successfully", value))
            .catch((e) => ApiResponse.error(e))
            .finally(() => res.end())
    }


    static async updateBarber(req: AuthRequest, res: Response): Promise<any> {

        const body = req.body;
        await BarberService.updateBarber(body)
            .then((value) => ApiResponse.success("Barber details updated successfully", value))
            .catch((e) => ApiResponse.error(e))
            .finally(() => res.end())
    }

    static async getAllBarbersOfShop(req: AuthRequest, res: Response): Promise<any> {
        const id = req.params.id;
        await BarberService.getAllBarbers(id)
            .then((value) => ApiResponse.success("Barbers fetched successfully", value))
            .catch((e) => ApiResponse.error(e))
            .finally(() => res.end())
    }

    static async toggelBarberAvailability(req: AuthRequest, res: Response): Promise<any> {
        const parsed = BarberAvailabilitySchema.safeParse(req.body);
        if (!parsed.success) {
            ApiResponse.error(parsed.error)
        }
        await BarberService.toggleAvailability(parsed.data!.available, parsed.data!.id)
            .then((value) => ApiResponse.success("Barber availability changed successfully", value))
            .catch((e) => ApiResponse.error(e))
            .finally(() => res.end());
    }

}