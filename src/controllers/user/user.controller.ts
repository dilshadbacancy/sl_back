import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { ApiResponse } from "../../utils/apiResponse";
import { UpdateLocationDto } from "../../schema/user/update_location.dto";
import { UpdateStatusDto } from "../../schema/user/soft_delete.dto";
import { UserService } from "../../service/user/user.service";
import { CreateUserDto } from "../../schema/user/user.dto";
export class UserController {

    static async saveUserProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const body = req.body;
            const user_id = body.user_id || req.user?.id;

            if (!user_id) {
                return ApiResponse.error("User ID is required", 400);
            }

            const parsed = CreateUserDto.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponse.error(parsed.error);
            }

            const user = await UserService.saveUserProfile(parsed.data, user_id);
            ApiResponse.success("User saved successfully", user);
        } catch (error) {
            ApiResponse.error(error);
        }
    }



    static async updateUserProfile(req: AuthRequest, res: Response): Promise<void> {
        const data = req.body;
        const user_id = data.user_id || req.user?.id;
        await UserService.updateUserProfile(data, user_id)
            .then((value) => ApiResponse.success("User updated successfully"))
            .catch((error) => ApiResponse.error(error))
    }

    static async getUserProfile(req: AuthRequest, res: Response): Promise<void> {
        const id = req.user?.id || "";
        if (!id) {
            return ApiResponse.error("User ID is required", 400);
        }
        await UserService.getUserProfile(id)
            .then((value) => ApiResponse.success("User profile fetched.", value))
            .catch((error) => ApiResponse.error(error))
    }

    static async updateUserLocation(req: AuthRequest, res: Response): Promise<void> {
        const parsed = UpdateLocationDto.safeParse(req.body);
        if (!parsed.success) {
            return ApiResponse.error(parsed.error);
        }

        await UserService.updateUserLocation(parsed.data)
            .then((value) => ApiResponse.success("Location updated successfully."))
            .catch((error) => ApiResponse.error(error));
    }


    static async getAllUserStatus(req: AuthRequest, res: Response): Promise<void> {
        await UserService.getAllUserStatus()
            .then((val) => ApiResponse.success("User status are fetched successfully", val))
            .catch((e) => ApiResponse.error(e))
    }

    static async getAllGenders(req: AuthRequest, res: Response): Promise<any> {
        await UserService.getAllGenders()
            .then((val) => ApiResponse.success("All available genders fetched successfully", val))
            .catch((e) => ApiResponse.error(e))
    }

    static async getAllRoles(req: AuthRequest, res: Response): Promise<any> {
        await UserService.getAllRoles()
            .then((value) => ApiResponse.success("All available roles fetched successfully", value))
            .catch((e) => ApiResponse.error(e))
    }

    static async updateUserStatus(req: Request, res: Response): Promise<void> {
        const parsed = UpdateStatusDto.safeParse(req.body);
        if (!parsed.success) {
            return ApiResponse.error(parsed.error);
        }

        await UserService.updateUserStatus(parsed.data)
            .then((value) => ApiResponse.success("Success", value))
            .catch((e) => ApiResponse.error(e))
    }

    static async checkProfileCompletion(req: AuthRequest, res: Response): Promise<any> {
        const id = req.user?.id;
        if (!id) {
            return ApiResponse.error("User ID is required", 400);
        }
        await UserService.checkProfileCompletetion(id)
            .then((val) => ApiResponse.success("Success", val))
            .catch((e) => ApiResponse.error(e))
    }

}