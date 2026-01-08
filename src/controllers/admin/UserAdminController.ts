import { AuthRequest } from "../../middlewares/auth.middleware";
import { Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import { UpdateAdminUserSchema } from "../../schema/admin/AdminUserSchema";
import { AdminUserService } from "../../service/admin/AdminUserService";
import { AppErrors } from "../../errors/app.errors";

export class UserAdminController {



    static async getUserAdminProfile(req: AuthRequest, res: Response): Promise<any> {
        try {

            const userId = req.user?.id;
            const adminUserProfile = await AdminUserService.getAdminUserProfile(userId!);
            return ApiResponse.success("Profile fetched successfully", adminUserProfile);
        } catch (error: any) {
            throw new AppErrors(error.message);
        }
    }


    static async updateUserAdminProfile(req: AuthRequest, res: Response) {
        try {

            const rewuestBody = req.body;

            const parsedBody = UpdateAdminUserSchema.safeParse(rewuestBody);
            if (!parsedBody.success) {
                return ApiResponse.error(parsedBody.error);
            }

            const result = await AdminUserService.updateUserAdminProfile(parsedBody.data)
            return ApiResponse.success("Profile updated successfully", result);
        } catch (error) {
            return ApiResponse.error(error);
        }
    }

}