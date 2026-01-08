import { Request, Response } from "express";
import { AdminLoginSchema, ChangeAdminPassowrdSchema, CreateAdminSchema } from "../../schema/admin/AuthSchma";
import { ApiResponse } from "../../utils/apiResponse";
import { AdminAuthService } from "../../service/admin/AdminAuth.service";
import { AuthRequest, blackListToken } from "../../middlewares/auth.middleware";


export class AuthAdminController {

    static async registerAdmin(req: Request, res: Response) {
        try {
            const requestBody = req.body;

            const parsedBody = CreateAdminSchema.safeParse(requestBody);

            if (!parsedBody.success) {
                return ApiResponse.error(parsedBody.error);
            }

            const result = await AdminAuthService.registerAdmin(parsedBody.data);
            return ApiResponse.success("Admin created successfully. You can log in using your credentials.", result)
        } catch (e) {
            return ApiResponse.error(e)
        }
    }


    static async loginAdmin(req: Request, res: Response) {
        try {

            const requestBody = req.body;
            const parsedBody = AdminLoginSchema.safeParse(requestBody);

            if (!parsedBody.success) {
                return ApiResponse.error(parsedBody.error);
            }

            const result = await AdminAuthService.loginAdmin(parsedBody.data)
            return ApiResponse.success("Login successfully", result);
        } catch (error) {
            return ApiResponse.error(error);
        }
    }


    static async changeAdminPassword(req: AuthRequest, res: Response) {
        try {

            const requestBody = req.body;
            const parsedBody = ChangeAdminPassowrdSchema.safeParse(requestBody);

            if (!parsedBody.success) {
                return ApiResponse.error(parsedBody.error);
            }

            const result = await AdminAuthService.changePassword(parsedBody.data);
            return ApiResponse.success(result);
        } catch (error) {
            return ApiResponse.error(error);
        }
    }


    static async logoutAdminUser(req: AuthRequest, res: Response) {

        try {
            const authorization = req.headers.authorization!;
            const token = authorization.split(' ')[1]
            const result = await AdminAuthService.logoutAdminUser(token);
            return ApiResponse.success(result);

        } catch (error) {
            return ApiResponse.error(error);
        }
    }
}