import { AppErrors } from "../../errors/app.errors";
import { Shop } from "../../models/vendor/shop.model";
import { ShopLocation } from "../../models/vendor/shop_location";
import { ShopKycDetail } from "../../models/vendor/shop_kyc.model";
import Service from "../../models/vendor/service.model";
import { User } from "../../models/user/user.model";
import ShopBankDetails from "../../models/vendor/shop_bank_details";
import { Barber } from "../../models/vendor/barber.model";
import { HelperUtils } from "../../utils/helper";

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
        const route = await HelperUtils.resolveAndUpdateUserRoute(shop.user_id);
        return {
            shop_id: shop.id,
            user_id: shop.user_id,
            message: "Shop saved successfully",
            route: route.route,
        }
    }

    static async saveSaloonShopLocation(data: any): Promise<any> {

        try {

            const location = await ShopLocation.create(data)
            const route = await HelperUtils.resolveAndUpdateUserRoute(location.user_id);
            return {
                shop_id: location.shop_id,
                user_id: location.user_id,
                message: "Shop location updated successfuly",
                route: route.route,
            }
        } catch (e) {
            throw new AppErrors(e);
        }
    }


    static async saveSaloonShopKyc(data: any): Promise<any> {


        const kyc = await ShopKycDetail.create(data);
        const route = await HelperUtils.resolveAndUpdateUserRoute(kyc.user_id);
        return {
            shop_id: kyc.shop_id,
            message: "Vendor KYC details updated successfuly",
            route: route.route,
        }
    }

    static async saveSaloonShopBankDetails(data: any): Promise<any> {

        const bank = await ShopBankDetails.create(data);
        const route = await HelperUtils.resolveAndUpdateUserRoute(bank.user_id);
        return {
            bank: bank.shop_id,
            message: "Vendor bank details updated successfuly",
            route: route.route,
        }
    }

    static async getShopProfile(user_id: string): Promise<any> {
        try {
            const shop = await Shop.findOne({
                where: { user_id: user_id }, include: [
                    {
                        model: User,
                        as: "shop_user",
                    },
                    {
                        model: ShopLocation,
                        as: "shop_location"
                    },
                    {
                        model: ShopKycDetail,
                        as: "shop_kyc_details"
                    },

                    {
                        model: ShopBankDetails,
                        as: "shop_bank_details"
                    },
                    {
                        model: Service,
                        as: "shop_services"
                    },
                    {
                        model: Barber,
                        as: "shop_barbers",
                        attributes: {
                            exclude: ["username", "login_pin", "role"]
                        }
                    },


                ],
                attributes: {
                    exclude: ["services", "user_id", "createdAt", "updatedAt"]
                }
            })
            if (!shop) {
                throw new AppErrors("No Shop Vendor found")
            }


            const shopData = shop.toJSON();
            shopData.barber_count = shopData.shop_barbers ? shopData.shop_barbers.length : 0;
            shopData.service_count = shopData.shop_services ? shopData.shop_services.length : 0;
            shopData.self_employed = shopData.barber_count === 0;



            const barberGender = new Set(
                shopData.shop_barbers.map((b: any) => b.gender.toLowerCase())
            );

            const serviceGender = new Set(
                shopData.shop_services.map((b: any) => b.gender.toLowerCase())
            )

            // Rules:
            const hasMaleBarber = barberGender.has("male");
            const hasFemaleBarber = barberGender.has("female");
            const hasUnisexBarber = barberGender.has("unisex");
            const hasOthersBarber = barberGender.has("others");

            const hasMaleService = serviceGender.has("male");
            const hasFemaleService = serviceGender.has("female");
            const hasUnisexService = serviceGender.has("unisex");
            const hasOthersService = serviceGender.has("others");


            shopData.multi_gender_barbers =
                hasUnisexBarber ||                      // Unisex = both
                (hasMaleBarber && hasFemaleBarber) ||         // Both male & female
                (hasOthersBarber && (hasMaleBarber || hasFemaleBarber)); //


            shopData.multi_gender_services =
                hasUnisexService ||                      // Unisex = both
                (hasMaleService && hasFemaleService) ||         // Both male & female
                (hasOthersService && (hasMaleService || hasFemaleService)); //


            return {
                ...shopData,
            };
        } catch (error) {
            throw new AppErrors(error);
        }
    }



    static async createServices(data: any): Promise<Service> {

        const name = data.name;
        const gender = data.gender;

        let services = await Service.findOne({ where: { name: name, gender: gender } });

        if (services) {
            throw new AppErrors("This services is already exist")
        }
        services = await Service.create(data);
        return services;

    }

    static async getAllServices(): Promise<Service[]> {
        return await Service.findAll();
    }

    // Shop Services Management (previously in saloon)
    static async updateServiceOfShop(data: any): Promise<any> {
        const serviceId = data.id;
        const service = await Service.findByPk(serviceId);

        if (!service) {
            throw new AppErrors("Service does not exist for the reference id");
        }

        await service.update({ ...data });
        return service;
    }

    static async addServicesToShop(shopId: string, ids: string[]): Promise<any> {
        const shops = await Shop.findByPk(shopId);
        if (!shops) {
            throw new AppErrors("Shop not found");
        }

        const existingServices: string[] = shops.services || [];
        const newServices = ids.filter((id) => !existingServices.includes(id));

        if (newServices.length == 0) {
            throw new AppErrors("You already have these services");
        }

        const updatedService = [...existingServices, ...newServices];
        await shops.update({ services: updatedService });

        return {
            message: "Service added to your shops.",
            services: newServices,
            all_service: updatedService,
        };
    }
}