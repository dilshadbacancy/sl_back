import { Request, Response } from "express";
import { AdminLoginSchema, ChangeAdminPassowrdSchema, CreateAdminSchema, ResetAdminPasswordSchema } from "../../schema/admin/AuthSchma";
import { ApiResponse } from "../../utils/apiResponse";
import { AdminAuthService } from "../../service/admin/AdminAuthService";
import { AuthRequest, blackListToken } from "../../middlewares/auth.middleware";
import { AuthService } from "../../service/common/auth.service";


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

    static async getNewAccessToken(req: AuthRequest, res: Response) {

        try {
            const { refresh_token } = req.body;
            const authorization = req.headers.authorization!;
            const token = authorization?.split(' ')[1];
            if (!refresh_token) {
                return ApiResponse.error("Refresh token is required to accquire access token")
            }
            const result = await AdminAuthService.getNewAccessToken(refresh_token, token)
            return ApiResponse.success("New access token retrive successfully", result);

        } catch (error: any) {
            return ApiResponse.error(error);
        }
    }

    static async sendOtpForForgetPassword(req: AuthRequest, res: Response) {

        try {
            const { mobile } = req.body;
            const result = await AdminAuthService.sendOtpFotForgetPassword(mobile)
            return ApiResponse.success("One Time Password has been sent to you mobile number", result);
        } catch (error) {
            return ApiResponse.error(error);
        }
    }


    static async verifyOtpAndResetPassword(req: AuthRequest, res: Response) {
        try {
            const requestBody = req.body;

            const parsedBody = ResetAdminPasswordSchema.safeParse(requestBody);
            if (!parsedBody.success) {
                return ApiResponse.error(parsedBody.error);
            }
            const result = await AdminAuthService.verifyOtpAndResetPassword(parsedBody.data)
            return ApiResponse.success("Password reset successfully", result);
        } catch (error: any) {
            return ApiResponse.error(error);
        }
    }


}