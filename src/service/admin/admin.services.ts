import { AppErrors } from "../../errors/app.errors";
import Service from "../../models/admin/service.model";

export class AdminServies {

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
}