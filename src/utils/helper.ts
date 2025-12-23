
import bcrypt from "bcrypt";
import { Barber } from "../models/vendor/barber.mode";
import { User } from "../models/user/user.model";
import { ScreenSteps } from "./enum.utils";
import { Shop } from "../models/vendor/shop.model";
import { ShopLocation } from "../models/vendor/shop_location";
import { ShopKycDetail } from "../models/vendor/shop_kyc.model";
import ShopBankDetails from "../models/vendor/shop_bank_details";
import { AppErrors } from "../errors/app.errors";
import { OTP } from "../models/auth/otp.model";

export class HelperUtils {

    static async findUserByEmail(email: string): Promise<User | null> {
        const user = await User.findOne({ where: { email: email } })
        return user;
    }
    static async findUserById(id: string): Promise<User | null> {
        const user = await User.findByPk(id)
        return user;
    }

    static async findBarberById(id: string): Promise<Barber | null> {
        const barber = await Barber.findByPk(id)
        return barber;
    }

    static async findUserByPhone(phone: string): Promise<User | null> {
        const user = await User.findOne({ where: { mobile: phone } })
        return user;
    }

    static async hashPassowrd(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);

    }


    static generateOTP(): string {
        const otp = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, '0');
        return otp;

    }

    static shouldUpdateLocation(updatedAt: any) {
        const now = new Date();
        const lastUpdated = new Date(updatedAt);
        const diffMs = now.getTime() - lastUpdated.getTime();        // difference in milliseconds
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays > 5;
    }


    static generateUsername(name: string): string {
        const base = name.toLowerCase().replace(/\s+/g, "");
        const random = Math.floor(1000 + Math.random() * 9000); // 4-digit
        return `${base}${random}`;
    }

    static calculateDistance(lat1: any, lon1: any, lat2: any, lon2: any) {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in KM
    }


    static getAppointmentStatusLabel(label: string): string {

        switch (label) {
            case 'pending':
                return 'PENDING';
            case 'accepted':
                return 'ACCEPT';
            case 'inProgress':
                return 'IN PROGRESS';
            case 'conmpleted':
                return 'COMPLETE';
            case 'rejected':
                return 'REJECT';
            case 'cancelled':
                return 'CANCELL';
            default:
                return label.toUpperCase();
        }
    }



    static async resolveAndUpdateUserRoute(userId: string): Promise<any> {
        const user = await User.findByPk(userId);
        if (!user) throw new AppErrors("User not found");

        let resolvedRoute: any = {};

        const otp = await OTP.findOne({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']],
        });

        // 1️⃣ No OTP requested
        if (!otp) {
            resolvedRoute.route = ScreenSteps.INITIAL_SCREEN;
        }
        // 2️⃣ OTP requested but not verified
        else if (!otp.is_otp_verified) {
            resolvedRoute.route = ScreenSteps.OTP_SCREEN;
        }
        // 3️⃣ OTP verified → start onboarding
        else {
            // 🔹 NEW STEP: User basic profile check
            const isUserProfileIncomplete =
                !user.first_name ||
                !user.last_name ||
                !user.email ||
                !user.gender ||
                !user.location;

            if (isUserProfileIncomplete) {
                resolvedRoute.route = ScreenSteps.USER_PROFILE_SCREEN;
            } else {
                // 🔹 Shop profile check
                const shopProfile = await Shop.findOne({
                    where: { user_id: userId }
                });

                if (!shopProfile) {
                    resolvedRoute.route = ScreenSteps.CREATE_SHOP_PROFILE_SCREEN;
                } else {
                    const location = await ShopLocation.findOne({
                        where: { shop_id: shopProfile.id }
                    });

                    if (!location) {
                        resolvedRoute.route = ScreenSteps.ADD_LOCATION_SCREEN;
                        resolvedRoute.shop_id = shopProfile.id;
                    } else {
                        const kyc = await ShopKycDetail.findOne({
                            where: { shop_id: shopProfile.id }
                        });

                        if (!kyc) {
                            resolvedRoute.route = ScreenSteps.ADD_SHOP_KYC_SCREEN;
                            resolvedRoute.shop_id = shopProfile.id;
                        } else {
                            const bank = await ShopBankDetails.findOne({
                                where: { shop_id: shopProfile.id }
                            });

                            if (!bank) {
                                resolvedRoute.route = ScreenSteps.ADD_BANK_DETAILS_SCREEN;
                                resolvedRoute.shop_id = shopProfile.id;
                            } else {
                                resolvedRoute.route = ScreenSteps.DASHBOARD_SCREEN;
                                resolvedRoute.shop_id = shopProfile.id;
                            }
                        }
                    }
                }
            }
        }

        // 🔐 Persist route safely
        if (user.route !== resolvedRoute.route) {
            const isOnboardingCompleted =
                resolvedRoute.route === ScreenSteps.DASHBOARD_SCREEN;

            await user.update({
                route: resolvedRoute.route,
                is_onboarding_completed: isOnboardingCompleted,
            });
        }

        return resolvedRoute;
    }




}
