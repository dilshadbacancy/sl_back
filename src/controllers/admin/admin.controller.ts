import { Request, Response } from "express";
import { AdminServies } from "../../service/admin/admin.services";
import { ApiResponse } from "../../utils/apiResponse";

export class AdminController {

    static async getAllVendors(req: Request, res: Response) {
        try {
            const vendors = await AdminServies.getAllVendors();
            return ApiResponse.success('Vendors retrieved successfully', vendors);
        } catch (error) {
            return ApiResponse.error('Failed to retrieve vendors');
        }
    }


    static async getAllCustomers(req: Request, res: Response) {
        try {
            const customers = await AdminServies.getAllCustomers();
            return ApiResponse.success('Customers retrieved successfully', customers);
        } catch (error) {
            return ApiResponse.error('Failed to retrieve customers');
        }

    }

    static async getAllAppointmentsByShopIdWithEarnings(req: Request, res: Response) {
        const shopId = Number(req.params.shopId);
        try {
            const result = await AdminServies.getAllAppointmentsByShopIdWithEarnings(shopId);
            return ApiResponse.success('Appointments and earnings retrieved successfully', result);
        } catch (error) {
            return ApiResponse.error('Failed to retrieve appointments and earnings');
        }
    }
}