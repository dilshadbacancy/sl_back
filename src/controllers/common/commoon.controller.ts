import { AuthRequest } from "../../middlewares/auth.middleware";
import { CreateFCMRecordSchema } from "../../schema/fcm_token.schema";
import { CommonService } from "../../service/common/common.service";
import { ApiResponse } from "../../utils/apiResponse";
import { CloudinaryService } from "../../utils/cloudinary.helper";
import { Request, Response } from "express";

export class CommonController {

    static async saveDeviceInfo(req: AuthRequest, res: Response): Promise<void> {

        const body = req.body;
        const user_id = req.user?.id || body.user_id;
        await CommonService.saveDeviceInfo(body, user_id)
            .then((val) => ApiResponse.success("Device updated successfully", val))
            .catch((e) => ApiResponse.error(e))

    }

    static async getDeviceInfo(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id || "";
        await CommonService.getDeviceInfo(userId)
            .then((val) => ApiResponse.success("Device information fetched", val))
            .catch((e) => ApiResponse.error(e))
    }

    static async saveFCMToken(req: AuthRequest, res: Response): Promise<any> {
        const parsed = CreateFCMRecordSchema.safeParse(req.body);

        if (!parsed.success) {
            ApiResponse.error(parsed.error);
        }

        await CommonService.saveFcmToken(parsed.data)
            .then((value) => ApiResponse.success("Token saved successfully"))
            .catch((e) => ApiResponse.error(e));
    }



    static async getFCMToken(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?.id;
        await CommonService.getFCMToken(userId!)
            .then((value) => ApiResponse.success("Fcm token fetched successfully", value))
            .catch((e) => ApiResponse.error(e))
    }

}