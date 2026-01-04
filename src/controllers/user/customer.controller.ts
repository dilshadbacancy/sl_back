import { AuthRequest } from "../../middlewares/auth.middleware";
import { ChangeAppointmentStatus, CreateAppointmentSchema, NearByShops } from "../../schema/user/customer.schema";
import { CustomerServies } from "../../service/user/customer.service";
import { ApiResponse } from "../../utils/apiResponse";
import { Response } from "express";
import { AppointmentStatus } from "../../utils/enum.utils";

export class CustomerController {

    static async fetchNearByShops(req: AuthRequest, res: Response): Promise<void> {
        // Convert query params to numbers for validation
        const queryData = {
            latitude: req.query.latitude ? Number(req.query.latitude) : undefined,
            longitude: req.query.longitude ? Number(req.query.longitude) : undefined,
            radius: req.query.radius ? Number(req.query.radius) : undefined
        };

        const parsed = NearByShops.safeParse(queryData);

        if (!parsed.success) {
            return ApiResponse.error(parsed.error);
        }

        await CustomerServies.fetchNearByShops(parsed.data)
            .then((value) => ApiResponse.success("All available near by shops fetched..", value))
            .catch((e) => ApiResponse.error(e))
    }


    static async bookAppointment(req: AuthRequest, res: Response): Promise<any> {
        const parsed = CreateAppointmentSchema.safeParse(req.body);

        if (!parsed.success) {
            return ApiResponse.error(parsed.error);
        }
        await CustomerServies.createAppointment(parsed.data)
            .then((value) => ApiResponse.success("Appointment submitted", value))
            .catch((e) => ApiResponse.error(e))
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
        const barber_id = req.query.barber_id as string;
        const status = req.query.status as AppointmentStatus;
        await CustomerServies.getAllAppointments(status, shop_id, user_id, barber_id)
            .then((value) => ApiResponse.success("Appointments fetched successfully", value))
            .catch((e) => ApiResponse.error(e))
    }


    static async changeAppointmentStatus(req: AuthRequest, res: Response): Promise<void> {
        const data = ChangeAppointmentStatus.safeParse(req.body);
        if (!data.success) {
            return ApiResponse.error(data.error);
        }
        const userId = req.user?.id;
        await CustomerServies.changeAppointmentStatus(data.data, userId)
            .then((value) => ApiResponse.success("Appointment status changed to" + ` ${value.status}`, value))
            .catch((e) => ApiResponse.error(e))
    }

    static async getPaymentsModes(req: AuthRequest, res: Response): Promise<void> {
        await CustomerServies.getPaymentModes()
            .then((value) => ApiResponse.success("Payment modes fetched successfully", value))
            .catch((e) => ApiResponse.error(e))
    }

    static async getAppointmentsStatus(req: AuthRequest, res: Response): Promise<void> {
        await CustomerServies.getAppointmentsStatus()
            .then((value) => ApiResponse.success("Appointment status fetched successfully", value))
            .catch((e) => ApiResponse.error(e))
    }


    static async getAllCategory(req: AuthRequest, res: Response): Promise<void> {
        await CustomerServies.getAllCategory()
            .then((value) => ApiResponse.success("All category fetched successfully", value))
            .catch((e) => ApiResponse.error(e))
    }

}