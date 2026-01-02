
import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { BarberAvailabilitySchema, BarberSchema } from "../../schema/vendor/barber.schema";
import { ApiResponse } from "../../utils/apiResponse";
import { BarberService } from "../../service/vendor/barber.service";
import { BarberAuthReq as BarberAuthRequest } from "../../middlewares/barber.auth.middleware";
import z from "zod";

export class BarberController {


    /// Barber Only-------

    static async loginBarber(req: Request, res: Response): Promise<void> {
        const { username, login_pin } = req.body;
        
        if (!username || !login_pin) {
            return ApiResponse.error("Username and login PIN are required", 400);
        }

        await BarberService.loginBarber(username, login_pin)
            .then((value) => ApiResponse.success("Login successfully", value))
            .catch((e) => ApiResponse.error(e))
    }

    static async getBarberProfile(req: BarberAuthRequest, res: Response): Promise<void> {
        const id = req.barber?.id;
        if (!id) {
            return ApiResponse.error("Barber ID is required", 400);
        }
        await BarberService.getBarbersProfile(id)
            .then((value) => ApiResponse.success("Barber profile fetched", value))
            .catch((e) => ApiResponse.error(e))
    }




    /// Vendor and Barbar inter relateed

    static async createBarber(req: AuthRequest, res: Response): Promise<void> {
        const parsed = BarberSchema.safeParse(req.body);

        if (!parsed.success) {
            return ApiResponse.error(parsed.error);
        }

        await BarberService.createBarber(parsed.data)
            .then((value) => ApiResponse.success("Barber added successfully", value))
            .catch((e) => ApiResponse.error(e))
    }


    static async updateBarber(req: AuthRequest, res: Response): Promise<void> {
        const body = req.body;
        if (!body.id) {
            return ApiResponse.error("Barber ID is required", 400);
        }
        await BarberService.updateBarber(body)
            .then((value) => ApiResponse.success("Barber details updated successfully", value))
            .catch((e) => ApiResponse.error(e))
    }

    static async getAllBarbersOfShop(req: AuthRequest, res: Response): Promise<void> {
        const id = req.params.id;

        if (!id) {
            return ApiResponse.error("Shop ID is required", 400);
        }

        const querySchema = z.object({
            available: z.preprocess((val) => {
                if (val === undefined) return undefined; // allow missing param
                if (val === "true") return true;
                if (val === "false") return false;
                return val; // leave as is → will fail below
            }, z.boolean().optional())
        });

        const parsed = querySchema.safeParse(req.query);
        await BarberService.getAllBarbers(id, parsed.data?.available)
            .then((value) => ApiResponse.success("Barbers fetched successfully", value))
            .catch((e) => ApiResponse.error(e))
    }

    static async toggelBarberAvailability(req: AuthRequest, res: Response): Promise<void> {
        const parsed = BarberAvailabilitySchema.safeParse(req.body);
        if (!parsed.success) {
            return ApiResponse.error(parsed.error);
        }
        await BarberService.toggleAvailability(parsed.data.available, parsed.data.id)
            .then((value) => ApiResponse.success("Barber availability changed successfully", value))
            .catch((e) => ApiResponse.error(e))
    }


    static async getAllAppointments(req: BarberAuthRequest, res: Response): Promise<void> {
        const id = req.barber?.id;
        if (!id) {
            return ApiResponse.error("Barber ID is required", 400);
        }
        await BarberService.getAllApointment(id)
            .then((value) => ApiResponse.success("Appointments fetched", value))
            .catch((e) => ApiResponse.error(e))
    }

}