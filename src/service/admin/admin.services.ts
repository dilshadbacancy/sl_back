import { AppErrors } from "../../errors/app.errors";
import { Appointment } from "../../models/user/appointment";
import { User } from "../../models/user/user.model";
import Service from "../../models/vendor/service.model";
import { Shop } from "../../models/vendor/shop.model";
import { Roles } from "../../utils/enum.utils";
import { CustomerServies } from "../user/customer.service";

export class AdminServies {


    static async getAllVendors(): Promise<Shop[]> {
        try {
            const venodors = await User.findAll({ where: { role: Roles.VENDOR } })

            let userIds = venodors.map(ven => ven.getDataValue('id'));


            const shops = await Shop.findAll({
                where: { user_id: userIds }
            });
            return shops;
        } catch (error) {
            throw new AppErrors('Failed to retrieve services', 500);
        }
    }

    static async getAllCustomers(): Promise<User[]> {
        try {
            const customers = User.findAll({ where: { role: Roles.CUSTOMER } })
            return customers;
        } catch (error) {
            throw new AppErrors('Failed to retrieve services', 500);
        }

    }




    static async getAllAppointmentsByShopIdWithEarnings(shopId: number): Promise<any> {
        try {
            const appointements = await CustomerServies.getAllAppointments();
            const totalEarnings = appointements.reduce((sum: number, appt: any) => sum + (appt.earnings || 0), 0);
            return { appointements, totalEarnings };
        } catch (error) {
            throw new AppErrors('Failed to retrieve services', 500);
        }

    }
}