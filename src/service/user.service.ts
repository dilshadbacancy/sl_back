import { ca, da } from "zod/v4/locales";
import { AppErrors } from "../errors/app.errors";
import { User } from "../models/user.model";
import { CreateUserDto } from "../schema/user/user.dto";
import { ApiResponse } from "../utils/apiResponse";
import { Status } from "../utils/enum.utils";

export class UserService {

    static async saveUserProfile(data: any, user_id: string): Promise<User> {
        try {

            const parsed = CreateUserDto.safeParse(data)
            if (!parsed.success) {
                ApiResponse.error(parsed.error);
            }

            const user = await User.findByPk(user_id);
            if (!user) {
                throw new AppErrors("User not found")
            }

            await user.update({ ...data })

            return user;
        } catch (error) {
            throw new AppErrors(error)
        }
    }

    static async getUserProfile(id: string): Promise<User | null> {
        try {
            const user = User.findByPk(id)
            if (!user) {
                throw new AppErrors("User not found");
            }
            return user;
        } catch (error) {
            throw new AppErrors("User profile not found")
        }
    }

    static async updateUserStatus(data: any): Promise<any> {
        const userId = data.user_id;
        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppErrors("User not found")
        }
        await user.update({ status: data.status })
        return data;
    }

    static async updateUserProfile(data: any, user_id: string): Promise<any> {
        try {
            const [affectedCount] = await User.update({ ...data }, { where: { id: user_id } })
            return { affectedCount };
        } catch (e) {
            throw new AppErrors(e);
        }

    }

    static async updateUserLocation(data: any): Promise<any> {
        try {
            const user = await User.findByPk(data.user_id)
            if (!user) {
                throw new AppErrors("User not found")
            }
            user.update({ ...data })
            return user;
        } catch (e) {
            throw new AppErrors(e);
        }
    }


    static async getAllUserStatus(): Promise<any> {

        const list = Object.values(Status).map((value) => ({
            label: value.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
            value
        }));
        return list;
    }

    static async checkProfileCompletetion(userId: string): Promise<any> {

        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppErrors("User not found.")
        }
        const hasBasic =
            !!user.first_name &&
            !!user.last_name &&
            !!user.email;

        const loc = user.location;

        const hasLocation =
            loc &&
            !!loc.country &&
            !!loc.state &&
            !!loc.city &&
            !!loc.latitude &&
            !!loc.longitude;
        return {
            profile_completed: hasBasic && hasLocation,
            basic_profile_copleted: hasBasic,
            location_completed: hasLocation
        }
    }


}