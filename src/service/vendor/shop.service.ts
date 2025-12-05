import { AppErrors } from "../../errors/app.errors";
import { Shop } from "../../models/vendor/shop.model";
import { ShopLocation } from "../../models/vendor/shop_location";
import { ShopKycDetail } from "../../models/vendor/shop_kyc.model";
import Service from "../../models/admin/service.model";
import { User } from "../../models/user/user.model";
import ShopBankDetails from "../../models/vendor/shop_bank_details";
import { Barber } from "../../models/vendor/barber.mode";

export class ShopServices {

    static async saveSaloonShop(data: any): Promise<any> {
        const shopName = data.shop_name;
        let shop = await Shop.findOne({
            where: { shop_name: shopName }
        });

        if (shop) {
            throw new AppErrors("Shop is already exist with the same shop name")
        }
        shop = await Shop.create(data);
        return {
            shop_id: shop.id,
            user_id: shop.user_id,
            message: "Shop saved successfully",
            profile_completed: false,
        }
    }

    static async saveSaloonShopLocation(data: any): Promise<any> {

        try {

            const location = await ShopLocation.create(data)
            return {
                shop_id: location.shop_id,
                user_id: location.user_id,
                message: "Shop location updated successfuly",
                profile_completed: false,
            }
        } catch (e) {
            throw new AppErrors(e);
        }
    }


    static async saveSaloonShopKyc(data: any): Promise<any> {

        const shopId = data.shop_id;

        const kyc = await ShopKycDetail.create(data);
        return {
            shop_id: kyc.shop_id,
            message: "Vendor KYC details updated successfuly",
            profile_completed: false,
        }
    }

    static async saveSaloonShopBankDetails(data: any): Promise<any> {

        const bank = await ShopBankDetails.create(data);
        return {
            bank: bank.shop_id,
            message: "Vendor bank details updated successfuly",
            profile_completed: true,
        }
    }

    static async getShopProfile(user_id: string): Promise<any> {
        try {
            const shop = await Shop.findOne({
                where: { user_id: user_id }, include: [
                    {
                        model: ShopLocation,
                        as: "location"
                    },
                    {
                        model: ShopKycDetail,
                        as: "shop_kyc_details"
                    },
                    {
                        model: User,
                        as: "shop_user",
                        attributes: { exclude: ["location"] }
                    },
                    {
                        model: ShopBankDetails,
                        as: "shop_bank_details"
                    },
                    {
                        model: Barber,
                        as: "shop_barbers",
                        attributes: {
                            exclude: ["username", "login_pin", "role"]
                        }
                    }

                ]
            })
            if (!shop) {
                throw new AppErrors("No Shop Vendor found")
            }

            const serviceIds = shop.services;
            let services = [];

            for (const id of serviceIds) {
                const service = await Service.findByPk(id);
                services.push(service);
            }
            const shopData = shop.toJSON();
            shopData.barber_count = shopData.shop_barbers ? shopData.shop_barbers.length : 0;
            shopData.self_employed = shopData.barber_count === 0;

            return {
                ...shopData,
                services,
            };
        } catch (error) {
            throw new AppErrors(error);
        }
    }
}