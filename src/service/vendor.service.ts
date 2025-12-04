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
            vendor.update({ location_details: location_details });
            return {
                id: vendor.id,
                message: "Vendor location updated successfuly",
                profile_completed: false,
            }
        } catch (e) {
            throw new AppErrors(e);
        }

    }
}