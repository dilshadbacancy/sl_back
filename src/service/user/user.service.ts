import { AppErrors } from "../../errors/app.errors";
import { User } from "../../models/user/user.model";
import { Barber } from "../../models/vendor/barber.mode";
import Service from "../../models/vendor/service.model";
import { Shop } from "../../models/vendor/shop.model";
import ShopBankDetails from "../../models/vendor/shop_bank_details";
import { ShopKycDetail } from "../../models/vendor/shop_kyc.model";
import { ShopLocation } from "../../models/vendor/shop_location";
import { Gender, Roles, ScreenSteps, Status } from "../../utils/enum.utils";
import { HelperUtils } from "../../utils/helper";
import { ShopServices } from "../vendor/shop.service";


export class UserService {

    static async saveUserProfile(data: any, user_id: string): Promise<User> {
        try {

            const user = await User.findByPk(user_id);
            if (!user) {
                throw new AppErrors("User not found")
            }
            await user.update({ ...data })
            await HelperUtils.resolveAndUpdateUserRoute(user_id);

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
            throw new AppErrors("User not found");
        }

        /* ---------------- USER PROFILE ---------------- */
        const profile_completed =
            !!user.first_name &&
            !!user.last_name &&
            !!user.email &&
            !!user.location?.country &&
            !!user.location?.state &&
            !!user.location?.city &&
            !!user.location?.latitude &&
            !!user.location?.longitude;

        /* ---------------- SHOP ---------------- */
        const shop = await Shop.findOne({ where: { user_id: userId } });
        const shop_profile = !!shop;

        /* ---------------- SHOP LOCATION ---------------- */
        let shop_location = false;
        if (shop) {
            shop_location = !!await ShopLocation.findOne({
                where: { shop_id: shop.id },
            });
        }

        /* ---------------- SHOP KYC ---------------- */
        let shop_kyc = false;
        if (shop) {
            const kyc = await ShopKycDetail.findOne({
                where: { shop_id: shop.id },
            });
            shop_kyc = !!kyc?.is_verified;
        }

        /* ---------------- BANK DETAILS ---------------- */
        let bank_details = false;
        if (shop) {
            const bank = await ShopBankDetails.findOne({
                where: { shop_id: shop.id },
            });
            bank_details = !!bank?.is_verified;
        }

        /* ---------------- SERVICES ---------------- */
        let services_details = false;
        if (shop) {
            services_details = (await Service.count({
                where: { shop_id: shop.id },
            })) > 0;
        }

        /* ---------------- BARBERS ---------------- */
        let barbers_details = false;
        if (shop) {
            barbers_details = (await Barber.count({
                where: { shop_id: shop.id },
            })) > 0;
        }

        /* ---------------- STEP FLAGS ---------------- */
        const steps = {
            profile_completed,
            shop_profile,
            shop_location,
            shop_kyc,
            bank_details,
            services_details,
            barbers_details,
        };

        const onboarding_completed = user.is_onboarding_completed;

        /* ---------------- UI METADATA ---------------- */
        const STEP_META: Record<
            string,
            { label: string; cta: string, required: boolean }
        > = {
            profile_completed: {
                label: "Complete your profile",
                cta: "Update profile",
                required: true,
            },
            shop_profile: {
                label: "Create shop profile",
                cta: "Create shop",
                required: true,
            },
            shop_location: {
                label: "Add shop location",
                cta: "Add location",
                required: true,
            },
            shop_kyc: {
                label: "Add KYC details",
                cta: "Add now",
                required: false,
            },
            bank_details: {
                label: "Add bank details",
                cta: "Add bank",
                required: true,
            },
            services_details: {
                label: "Add services",
                cta: "Add services",
                required: true,
            },
            barbers_details: {
                label: "Add barbers",
                cta: "Add barbers",
                required: true,
            },
        };

        const STEP_ORDER = Object.keys(STEP_META);

        /* ---------------- PENDING STEPS ---------------- */
        const pending_steps = STEP_ORDER
            .filter(step => steps[step as keyof typeof steps] === false)
            .map(step => ({
                key: step,
                label: STEP_META[step].label,
                cta: STEP_META[step].cta,
                required: STEP_META[step].required,
            }));

        /* ---------------- COMPLETED STEPS ---------------- */
        const completed_steps = STEP_ORDER
            .filter(step => steps[step as keyof typeof steps] === true)
            .map(step => ({
                key: step,
                label: `${STEP_META[step].label} completed`,

            }));

        return {
            onboarding_completed,
            shop_id: shop?.id || null,
            steps,
            pending_steps,
            completed_steps,

        };
    }


}