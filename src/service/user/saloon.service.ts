import { Op, Sequelize } from "sequelize";
import { SequelizeConnection } from "../../config/database.config";
import { Shop } from "../../models/vendor/shop.model";
import { AppErrors } from "../../errors/app.errors";

export class SaloonService {

    static async addServicesToShop(shopId: string, ids: string[]): Promise<any> {
        const shops = await Shop.findByPk(shopId);
        if (!shops) {
            throw new AppErrors("Shop not found")
        }

        const existingServices: string[] = shops.services;

        const newServices = ids.filter((id) => !existingServices.includes(id));

        if (newServices.length == 0) {
            throw new AppErrors("You already have this services")
        }

        const updatedService = [...existingServices, ...newServices];

        await shops.update({ services: updatedService })

        return {
            message: "Service added to your shops.",
            services: newServices,
            all_service: updatedService,
        }

    }

}