import { AuthRequest } from "../../middlewares/auth.middleware";
import { CreateFCMRecordSchema } from "../../schema/fcm_token.schema";
import { CommonService } from "../../service/common/common.service";
import { ApiResponse } from "../../utils/apiResponse";
import { CloudinaryService } from "../../utils/cloudinary.helper";
import { Request, Response } from "express";
import { AppErrors } from "../../errors/app.errors";

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
        if (!userId) {
            return ApiResponse.error("User ID is required", 400);
        }
        await CommonService.getDeviceInfo(userId)
            .then((val) => ApiResponse.success("Device information fetched", val))
            .catch((e) => ApiResponse.error(e))
    }

    static async saveFCMToken(req: AuthRequest, res: Response): Promise<any> {
        const parsed = CreateFCMRecordSchema.safeParse(req.body);

        if (!parsed.success) {
            return ApiResponse.error(parsed.error);
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

    static async uploadMedia(req: AuthRequest, res: Response): Promise<any> {
        try {
            const { file } = req as AuthRequest & { file?: Express.Multer.File };
            const userId = req.user?.id || req.body.user_id;
            const role = req.user?.role;

            if (!file) {
                res.status(400).json({
                    success: false,
                    message: "No file provided",
                });
                return;
            }

            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: "Missing user context",
                });
                return;
            }

            const folder = typeof req.body?.folder === "string" ? req.body.folder.trim() : undefined;
            const uploadResult = await CommonService.uploadMedia(role!, userId, file, folder);

            res.status(201).json({
                success: true,
                message: "File uploaded successfully",
                data: {
                    format: uploadResult.format,
                    asset_id: uploadResult.asset_id,
                    asset_folder: uploadResult.asset_folder,
                    url: uploadResult.secure_url,
                },
            });
        } catch (e: any) {
            res.status(500).json({
                success: false,
                message: "File upload failed",
                errors: e?.message || "Unknown error",
            });
        }
    }

}