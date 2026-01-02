import { AppErrors } from "../../errors/app.errors";
import { TokenPayload } from "../../interfaces/jwt.payload";
import { blackListToken } from "../../middlewares/auth.middleware";
import { OTP } from "../../models/auth/otp.model";
import { RefreshToken } from "../../models/auth/RefreshToken.model";
import { User } from "../../models/user/user.model";
import { ScreenSteps } from "../../utils/enum.utils";
import { HelperUtils } from "../../utils/helper";
import { JwtUtils } from "../../utils/jwt_utils";

export class AuthService {

    static async sendOtp(mobile: string, role: string): Promise<any> {
        try {
            if (mobile.length !== 10) {
                throw new AppErrors("Mobile number must be 10 digits");
            }

            let user = await HelperUtils.findUserByPhone(mobile);

            if (!user) {
                user = await User.create({
                    mobile,
                    role,
                    is_verified: false,
                });
            }

            const newOtp = HelperUtils.generateOTP();
            const expireAt = new Date(Date.now() + 5 * 60 * 1000);

            const otp = await OTP.upsert({
                user_id: user.id,
                mobile,
                code: newOtp,
                expire_at: expireAt,
                is_otp_verified: false,
            });

            // ✅ get updated route
            const route = await HelperUtils.resolveAndUpdateUserRoute(user.id);
            const otpJson = otp[0].toJSON();
            delete otpJson.id;
            return {
                ...otpJson,
                route: route.route, // ✅ correct route
            };
        } catch (error: any) {
            throw new AppErrors(error.message || "Error sending OTP");
        }
    }

    static async verifyOTP(
        code: string,
        mobile: string,
        user_id?: string
    ): Promise<any> {
        try {
            const record = await OTP.findOne({
                where: { code, mobile, user_id },
            });

            if (!record) throw new AppErrors("Invalid OTP or mobile number");

            if (new Date() > record.expire_at) {
                throw new AppErrors("OTP has expired");
            }

            await record.update({ is_otp_verified: true });

            // 🔑 THIS IS WHAT FRONTEND NEEDS
            const route = await HelperUtils.resolveAndUpdateUserRoute(record.user_id)

            const user = await User.findByPk(user_id);
            if (!user) throw new AppErrors("User not found");



            // Tokens
            const payload: TokenPayload = user;

            const accessToken = JwtUtils.generateAccessToken(payload);
            const refreshToken = JwtUtils.generateRefreshToken(payload);

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            await user.update({ is_verified: record.is_otp_verified })

            await RefreshToken.upsert({
                user_id: user.id,
                role: user.role,
                token: refreshToken,
                expire_at: expiresAt,
                is_revoked: false,
            });
            return {
                user: {
                    ...user.toJSON(),
                    shop_id: route.shop_id,
                },
                access_token: accessToken,
                refresh_token: refreshToken
            };
        } catch (error: any) {
            throw new AppErrors(error.message || "Error verifying OTP");
        }
    }


    static async logoutUser(token: string): Promise<any> {
        try {
            blackListToken(token)
            const res = {
                sucess: true,
                message: "User Logged out successfully"
            };
            return res;
        } catch (error: any) {
            throw new AppErrors(error.message);
        }
    }

    static async generateNewAccessToken(refreshToken: string): Promise<any> {
        try {
            if (!refreshToken) {
                throw new AppErrors("Refresh token required", 400);
            }
            const tokenPayload = JwtUtils.verifyRefreshToken(refreshToken);

            const storedToken = await RefreshToken.findOne({
                where: {
                    token: refreshToken,
                    user_id: tokenPayload.id,
                    is_revoked: false
                }
            });

            if (!storedToken) {
                throw new AppErrors("Invalid or revoked refresh token", 401);
            }

            if (new Date() > storedToken.expire_at) {
                throw new AppErrors("Refresh token expired. Login again", 401);
            }

            const user = await User.findByPk(storedToken.user_id);
            if (!user) {
                throw new AppErrors("User not found", 404);
            }


            const payload: TokenPayload = user;

            const newRefresh = JwtUtils.generateRefreshToken(payload);
            const newAccess = JwtUtils.generateAccessToken(payload);

            await storedToken.update({ token: newRefresh });
            const res = {
                access_token: newAccess,
                refresh_token: newRefresh,
            };
            return res;
        } catch (e: any) {
            throw new AppErrors(e);
        }
    }


}