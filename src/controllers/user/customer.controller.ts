import { AuthRequest } from "../../middlewares/auth.middleware";
import { ChangeAppointmentStatus, CreateAppointmentSchema, NearByShops } from "../../schema/user/customer.schema";
import { CustomerServies } from "../../service/user/customer.service";
import { ApiResponse } from "../../utils/apiResponse";
import { Response } from "express";
import { AppointmentStatus } from "../../utils/enum.utils";
import { da } from "zod/v4/locales";

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


    static async bookAppointment(req: AuthRequest, res: Response): Promise<any> {

        const parsed = CreateAppointmentSchema.safeParse(req.body);

        if (!parsed.success) {
            ApiResponse.error(parsed.error);
        }
        await CustomerServies.createAppointment(parsed.data)
            .then((value) => ApiResponse.success("Appointment submitted", value))

    }

    static async assignAppointments(req: AuthRequest, res: Response): Promise<void> {

        const data = req.body;
        await CustomerServies.assignBarber(data.id, data.barberId, data.extra_duration)
            .then((value) => ApiResponse.success("Appointments accespted", value))
            .catch((e) => ApiResponse.error(e))
    }

    static async getAllAppoitments(req: AuthRequest, res: Response): Promise<void> {
        const user_id = req.query.user_id as string;
        const shop_id = req.query.shop_id as string;
        const status = req.query.status as AppointmentStatus;
        await CustomerServies.getAllAppointments(status, shop_id, user_id)
            .then((value) => ApiResponse.success("Appointments fetched successfully", value))
            .catch((e) => ApiResponse.error(e))
    }


    static async changeAppointmentStatus(req: AuthRequest, res: Response): Promise<void> {


        const data = ChangeAppointmentStatus.safeParse(req.body)
        if (!data.success) {
            ApiResponse.error(data.error);
        }
        await CustomerServies.changeAppointmentStatus(data.data)
            .then((value) => ApiResponse.success("Appointment status changed to" + ` ${value.status}`, value))
            .catch((e) => ApiResponse.error(e))

    }


}