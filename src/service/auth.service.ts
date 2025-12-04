import { AppErrors } from "../errors/app.errors";
import { TokenPayload } from "../interfaces/jwt.payload";
import { blackListToken } from "../middlewares/auth.middleware";
import { OTP } from "../models/auth/otp.model";
import { RefreshToken } from "../models/auth/RefreshToken.model";
import { User } from "../models/user.model";
import { HelperUtils } from "../utils/helper";
import { JwtUtils } from "../utils/jwt_utils";

export class AuthService {

    static async sendOtp(mobile: string): Promise<any> {
        try {
            if (mobile.length !== 10) {
                throw new AppErrors("Mobile number is not valid, It should be 10 digit");
            }
            let user = await HelperUtils.findUserByPhone(mobile);
            if (!user) {
                user = await User.create({ mobile: mobile })
            }
            const otp = HelperUtils.generateOTP();
            const expireAt = new Date(Date.now() + 5 * 60 * 1000)
            let otpRecords = await OTP.findOne({ where: { mobile: mobile, user_id: user.id } })
            if (!otpRecords) {
                otpRecords = await OTP.create({ code: otp, mobile: mobile, user_id: user.id, expireAt: expireAt });
            }
            otpRecords.update({ code: otp, mobile: mobile, expire_at: expireAt });
            const res = {
                code: otp,
                user_id: user.id,
                mobile: mobile,
            };
            return res;


        } catch (error: any) {
            throw new AppErrors(error);
        }
    }


    static async verifyOTP(code: string, mobile: string, user_id?: string): Promise<any> {
        try {
            const whereClause: any = { code, mobile };
            if (user_id) whereClause.user_id = user_id;

            const record = await OTP.findOne({ where: whereClause });
            if (!record) throw new AppErrors("Invalid OTP or mobile number");

            if (new Date() > record.expire_at)
                throw new AppErrors("OTP has expired. Please request a new one.");

            await record.update({ is_verified: true });

            const user = await User.findOne({ where: { id: user_id } });
            if (!user) throw new AppErrors("User not found");
            const isProfileCompleted =
                !!(user.first_name && user.last_name && user.email);

            await user.update({ is_profile_completeed: isProfileCompleted, is_verified: true });



            const payload: TokenPayload = user;
            const token = JwtUtils.generateAccessToken(payload)
            const refreshtoken = JwtUtils.generateRefreshToken(payload);

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            let refresh = await RefreshToken.findOne({ where: { user_id: user.id } })
            if (!refresh) {
                refresh = await RefreshToken.create({
                    user_id: user.id,
                    token: refreshtoken,
                    expire_at: expiresAt,
                    is_revoked: false
                })
            }
            await refresh.update({ token: refreshtoken, user_id: user.id, is_revoked: false })
            const res = {
                user: user.toJSON(),
                access_token: token,
                refresh_token: refreshtoken,
            }

            return res;

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