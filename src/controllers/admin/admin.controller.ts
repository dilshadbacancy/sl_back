import { Request, Response } from "express";
import { AdminServies } from "../../service/admin/admin.services";
import { ApiResponse } from "../../utils/apiResponse";
import { CreateServiceSchema } from "../../schema/admin/services";

export class AdminController {

    static async createService(req: Request, res: Response): Promise<void> {

        const parsed = CreateServiceSchema.safeParse(req.body);
        if (!parsed.success) {
            ApiResponse.error(parsed.error);
        }

        await AdminServies.createServices(parsed.data)
            .then((value) => ApiResponse.success("Service created successfully", value))
            .catch((e) => ApiResponse.error(e))

    }


    static async getAllServices(req: Request, res: Response): Promise<void> {
        await AdminServies.getAllServices()
            .then((value) => ApiResponse.success("Service fetched successfully", value))
            .catch((e) => ApiResponse.error(e))

    }
}