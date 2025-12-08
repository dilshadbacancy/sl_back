import { AppErrors } from "../../errors/app.errors";
import { User } from "../../models/user/user.model";
import { Gender, Roles, Status } from "../../utils/enum.utils";


export class UserService {

    static async saveUserProfile(data: any, user_id: string): Promise<User> {
        try {

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

    static async getAllRoles(): Promise<any> {
        const list = Object.values(Roles).map((value) => ({
            label: value.toUpperCase(),
            value: value.toLowerCase(),
        }))
        return list;
    }


    static async getAllGenders(): Promise<any> {
        const list = Object.values(Gender).map((value) => ({
            label: value.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
            value,
        }))
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