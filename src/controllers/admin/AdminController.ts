import { Request, Response } from "express";
import { AdminServices } from "../../service/admin/AdminServices";
import { ApiResponse } from "../../utils/apiResponse";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { AdminAppointmentsFilterSchema, AdminCustomerFilterSchema, AdminShopFilterSchema } from "../../schema/admin/AdmiinFilterSchema";

export class AdminController {

    static async getAllVendorShops(req: Request, res: Response) {
        try {

            const requestBody = req.body;
            const parsedBody = AdminShopFilterSchema.safeParse(requestBody || {});
            if (!parsedBody.success) {
                return ApiResponse.error(parsedBody.error);
            }
            const vendors = await AdminServices.getAllVendorShops(parsedBody.data);
            return ApiResponse.success('Vendors retrieved successfully', vendors);
        } catch (error) {
            return ApiResponse.error(error);
        }
    }


    static async getAllCustomers(req: Request, res: Response) {
        try {

            const requestBody = req.body || {};
            const parsedBody = AdminCustomerFilterSchema.safeParse(requestBody);
            if (!parsedBody.success) {
                return ApiResponse.error(parsedBody.error);
            }
            const customers = await AdminServices.getAllCustomers(parsedBody.data);
            return ApiResponse.success('Customers retrieved successfully', customers);
        } catch (error) {
            return ApiResponse.error(error);
        }
    }


    static async getAllAppointments(req: AuthRequest, res: Response) {
        try {

            const requestBody = req.body || {};
            const parsedBody = AdminAppointmentsFilterSchema.safeParse(requestBody);
            if (!parsedBody.success) {
                return ApiResponse.error(parsedBody.error);
            }
            const appointments = await AdminServices.getAllAppointments(parsedBody.data);
            return ApiResponse.success("All appointments fetched", appointments);
        } catch (error) {
            return ApiResponse.error(error);
        }
    }


    static async getAllAppointmentsByShopIdWithEarnings(req: Request, res: Response) {
        const shopId = Number(req.params.shopId);
        try {
            const result = await AdminServices.getAllAppointmentsByShopIdWithEarnings(shopId);
            return ApiResponse.success('Appointments and earnings retrieved successfully', result);
        } catch (error) {
            return ApiResponse.error(error);
        }
    }
}