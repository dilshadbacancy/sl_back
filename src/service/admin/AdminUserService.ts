import { AppErrors } from "../../errors/app.errors";
import { AdminUserModel } from "../../models/admin/admin.user.model";

export class AdminUserService {


    static async getAdminUserProfile(userId: string): Promise<AdminUserModel> {
        try {

            const adminUser = await AdminUserModel.findByPk(userId);
            if (!adminUser) {
                throw new AppErrors("User not found!!");
            }

            const { password, ...safeUser } = adminUser.toJSON();
            return safeUser;

        } catch (error: any) {
            throw new AppErrors(error.message)
        }
    }


    static async updateUserAdminProfile(data: any): Promise<AdminUserModel> {

        try {

            const adminUser = await AdminUserModel.findByPk(data.id);

            if (!adminUser) {
                throw new AppErrors("User not found!");
            }

            await adminUser.update({ ...data });
            return adminUser;

        } catch (error: any) {
            throw new AppErrors(error.message);
        }
    }

}