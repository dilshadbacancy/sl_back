import { email } from "zod";
import { AppErrors } from "../../errors/app.errors";
import { AdminUserModel } from "../../models/admin/admin.user.model";
import { Op } from "sequelize"
import { da } from "zod/v4/locales";
import { HelperUtils } from "../../utils/helper";
import { JwtUtils } from "../../utils/jwt_utils";
import { TokenPayload } from "../../interfaces/jwt.payload";
import { blackListToken } from "../../middlewares/auth.middleware";


export class AdminAuthService {


    static async registerAdmin(data: any): Promise<any> {
        try {
            const adminUser = await AdminUserModel.findOne({
                where: {
                    [Op.or]: [
                        { email: data.email },
                        { mobile: data.mobile },
                    ],
                },
            })

            // ✅ No user exists → create admin
            if (!adminUser) {


                const hashedPassword = await HelperUtils.hashPassword(data.password)

                const user = await AdminUserModel.create({
                    ...data,
                    password: hashedPassword,
                })
                const { password, ...safeUser } = user.toJSON()

                return safeUser;
            }

            // ✅ User exists → determine conflict
            if (adminUser.email === data.email && adminUser.mobile === data.mobile) {
                throw new AppErrors(
                    "An admin account already exists with this email and mobile number."
                )
            }

            if (adminUser.email === data.email) {
                throw new AppErrors(
                    "An admin account already exists with this email address."
                )
            }

            if (adminUser.mobile === data.mobile) {
                throw new AppErrors(
                    "An admin account already exists with this mobile number."
                )
            }

            // fallback (should never reach here)
            throw new AppErrors("Admin account already exists.")

        } catch (error) {
            throw new AppErrors("Failed to register admin user.")
        }
    }


    static async loginAdmin(data: any): Promise<any> {
        try {

            const adminUser = await AdminUserModel.findOne({ where: { email: data.email } })
            if (!adminUser) {
                throw new AppErrors("User not found")
            }

            const hasPasswordMathed = await HelperUtils.verifyPassword(data.password, adminUser.password)
            if (!hasPasswordMathed) {
                throw new AppErrors("Invalid email or password")
            }
            const tokenPayload: TokenPayload = {
                id: adminUser.id,
                role: adminUser.role,
                email: adminUser.email,
            }

            const accessToken = JwtUtils.generateAccessToken(tokenPayload)
            const refreshToken = JwtUtils.generateRefreshToken(tokenPayload);


            const { password, ...safeUser } = adminUser.toJSON();
            return {
                user: safeUser,
                access_token: accessToken,
                refresh_token: refreshToken
            }

        } catch (error: any) {
            throw new AppErrors(error.message);
        }
    }

    static async changePassword(data: any): Promise<string> {
        try {
            // 1️⃣ Find user
            const adminUser = await AdminUserModel.findByPk(data.id);
            if (!adminUser) {
                throw new AppErrors("User not found with the id");
            }

            // 2️⃣ Verify current password
            const isPasswordMatched = await HelperUtils.verifyPassword(
                data.currentPassword,
                adminUser.password
            );
            if (!isPasswordMatched) {
                throw new AppErrors("Your current password is incorrect");
            }

            // 3️⃣ Optional: Check new vs current password
            if (data.currentPassword === data.confirmPassword) {
                throw new AppErrors("New password must be different from current password");
            }

            // 4️⃣ Hash new password
            const hashedPassword = await HelperUtils.hashPassword(data.confirmPassword);

            // 5️⃣ Update password only
            await adminUser.update({ password: hashedPassword });

            return "Password updated successfully";

        } catch (error: any) {
            throw new AppErrors(error.message || "Failed to change password");
        }
    }

    static async logoutAdminUser(token: string): Promise<any> {
        try {
            blackListToken(token)
            const res = {
                sucess: true,
                message: "User Logged out successfully"
            };
            return res;
        } catch (e: any) {
            throw new AppErrors(e.message)
        }
    }


}