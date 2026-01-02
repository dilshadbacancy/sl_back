import { Request, Response } from "express";
import { AuthService } from "../../service/common/auth.service";
import { ApiResponse } from "../../utils/apiResponse";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { SendOtpSchema } from "../../schema/user/user.dto";

export class AuthController {
    static async sendOtp(req: Request, res: Response): Promise<void> {
        const parsed = SendOtpSchema.safeParse(req.body);
        if (!parsed.success) {
            return ApiResponse.error(parsed.error);
        }
        await AuthService.sendOtp(parsed.data.mobile, parsed.data.role)
            .then((value) => ApiResponse.success("OTP send successfully", value))
            .catch((e) => ApiResponse.error(e))
    }

    static async verifyOtp(req: Request, res: Response): Promise<void> {
        const { code, mobile, user_id } = req.body;
        await AuthService.verifyOTP(code, mobile, user_id)
            .then((value) => ApiResponse.success("OTP verified successfully", value))
            .catch((e) => ApiResponse.error(e))
    }

    static async logout(req: AuthRequest, res: Response): Promise<void> {
        const authorization = req.headers.authorization!;
        const token = authorization.split(' ')[1]
        await AuthService.logoutUser(token)
            .then((value) => ApiResponse.success("Logges out seccuessfully", value))
            .catch((e) => ApiResponse.error(e))
    }


    static async generateNewAccessToken(req: Request, res: Response): Promise<void> {
        const { refresh_token } = req.body;
        await AuthService.generateNewAccessToken(refresh_token)
            .then((value) => ApiResponse.success("New Access Token Generated", value))
            .catch((e) => ApiResponse.error(e))
    }
}