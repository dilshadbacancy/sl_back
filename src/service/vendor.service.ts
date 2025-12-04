import { Sequelize } from "sequelize";
import { AppErrors } from "../errors/app.errors";
import { VendorModel } from "../models/vendor/vendor.model";
import { SequelizeConnection } from "../config/database.config";
import { da } from "zod/v4/locales";

export class VendorService {

    static async saveVendorShopDetails(data: any): Promise<any> {
        const shopName = data.shop_details.shop_name;
        const userId = data.user_id;
        const sequelize = SequelizeConnection.getInstance();
        let vendor = await VendorModel.findOne({
            where: Sequelize.literal(
                `
                user_id = ${sequelize.escape(userId)} 
                 AND JSON_UNQUOTE(JSON_EXTRACT(shop_details, '$.shop_name')) = ${sequelize.escape(shopName)}
                `
            )
        });

        if (vendor) {
            throw new AppErrors("Vendor is already exist with the same shop name")
        }
        vendor = await VendorModel.create(data);
        return {
            id: vendor.id,
            message: "Vendor saved successfully",
            profile_completed: false,
        }
    }

    static async saveVendorLocationDetails(data: any): Promise<any> {

        try {
            const vendorId = data.id;
            const vendor = await VendorModel.findByPk(vendorId)
            if (!vendor) {
                throw new AppErrors("No vendor found")
            }
            const location_details = data.location_details;
            await vendor.update({ location_details: location_details });
            return {
                id: vendor.id,
                message: "Vendor location updated successfuly",
                profile_completed: false,
            }
        } catch (e) {
            throw new AppErrors(e);
        }

    }


    static async saveVendorServices(data: any): Promise<any> {
        const vendorId = data.id;
        const services = data.services;
        const vendor = await VendorModel.findByPk(vendorId)



        if (!vendor) {
            throw new AppErrors("Vendor not found")
        }

        await vendor.update({ services: services })
        return {
            id: vendor.id,
            message: "Vendor services updated successfuly",
            profile_completed: false,
        }

    }


    static async saveVendorKYCDetails(data: any): Promise<any> {

        const vendorId = data.id;
        const kyc_details = data.kyc_details;

        const vendor = await VendorModel.findByPk(vendorId);

        if (!vendor) {
            throw new AppErrors("No vendor found")
        }

        await vendor.update({ kyc_details: kyc_details })
        return {
            id: vendor.id,
            message: "Vendor KYC detauls updated successfuly",
            profile_completed: false,
        }
    }

    static async saveVendorBankDetail(data: any): Promise<any> {

        const vendorId = data.id;
        const bank_details = data.bank_details;

        const vendor = await VendorModel.findByPk(vendorId);

        if (!vendor) {
            throw new AppErrors("Vendor not found")
        }

        await vendor.update({ bank_details: bank_details })
        return {
            id: vendor.id,
            message: "Vendor bank details updated successfuly",
            profile_completed: true,
        }
    }

    static async getVendors(user_id: string): Promise<VendorModel[]> {
        try {
            const vendors = await VendorModel.findAll({ where: { user_id: user_id } })
            return vendors;
        } catch (error) {
            throw new AppErrors(error);
        }
    }
}