import { Op, Sequelize } from "sequelize";
import { SequelizeConnection } from "../../config/database.config";
import { Shop } from "../../models/vendor/shop.model";
import { AppErrors } from "../../errors/app.errors";
import Service from "../../models/admin/service.model";

export class SaloonService {
    static async updateServiceOfShop(data: any): Promise<any> {

        const serviceId = data.id;

        const service = await Service.findByPk(serviceId);

        if (!service) {
            throw new AppErrors("Service doesnot exist for the reference id");
        }

        await service.update({ ...data });

    }

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