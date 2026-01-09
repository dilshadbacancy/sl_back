import { AppErrors } from "../../errors/app.errors";
import { Appointment } from "../../models/user/appointment";
import { User } from "../../models/user/user.model";
import { AppointmentService } from "../../models/vendor/appointment_service.model";
import Service from "../../models/vendor/service.model";
import { Shop } from "../../models/vendor/shop.model";
import { Roles, Status } from "../../utils/enum.utils";
import { CustomerServies } from "../user/customer.service";
import { Op } from "sequelize";
import HelperFunctions from "../../utils/helper_functions";
import { da } from "zod/v4/locales";

export class AdminServices {


    static async getAllVendorShops(data: any): Promise<Shop[]> {
        try {

            console.log("Filtr Data:::: " + JSON.stringify(data));

            const venodors = await User.findAll({ where: { role: Roles.VENDOR } })

            let userIds = venodors.map(ven => ven.getDataValue('id'));
            const whereClause: any = { user_id: userIds, ...data };


            const shops = await Shop.findAll({
                where: whereClause,
                include: [
                    {
                        model: Appointment,
                        as: "appointments",
                        include: [
                            {
                                model: AppointmentService,
                                as: "services",
                            },
                        ],
                    },
                    {
                        model: Service,
                        as: "shop_services"
                    },
                    {
                        model: User,
                        as: "shop_user"
                    }
                ]
            });

            const formattedResponse = shops.map((shopInstance) => {
                const shop = shopInstance.get({ plain: true }) as any;

                const appointments = shop.appointments ?? [];

                const shopServices = shop.shop_services ?? [];

                const serviceNames = shopServices.map((serv: any) => serv.name);

                let totalEarnings = 0;

                for (const appointment of appointments) {
                    const services = appointment.services ?? [];

                    totalEarnings += services.reduce(
                        (sum: number, service: any) => sum + (service.price ?? 0),
                        0
                    );
                }

                const shopOwner = shop.shop_user;

                const shopOwnerName = `${shopOwner.first_name} ${shopOwner.last_name}`;
                const shopOwnerMobile = shop.mobile;

                delete shop.appointments;
                delete shop.services;
                delete shop.shop_services;
                delete shop.shop_user;

                return {
                    ...shop,
                    shop_owner_name: shopOwnerName,
                    shop_owner_mobile: shopOwnerMobile,
                    services: serviceNames,
                    total_earning: totalEarnings,
                };
            });

            return formattedResponse;
        } catch (error) {
            throw new AppErrors(error);
        }
    }

    static async getAllCustomers(data: any): Promise<User[]> {
        try {

            let whereClause: any = { role: Roles.CUSTOMER, ...data };
            const customers = await User.findAll({
                where: whereClause,
                include: [
                    {
                        model: Appointment,
                        as: "appointments",
                        include: [
                            {
                                model: AppointmentService,
                                as: "services",
                            }
                        ]
                    }
                ],
                attributes: {
                    exclude: ['route', "is_onboarding_completed"],

                }
            })

            const formattedResponse = customers.map((custInstance) => {
                const customer = custInstance.get({ plain: true }) as any;

                const appointments = customer.appointments ?? [];
                const lastIndex = appointments.length - 1;
                const lastVisit = appointments[lastIndex].appointment_date;

                let totalSpend = 0;

                let servicesCount = 0;
                for (const appointment of appointments) {
                    const services = appointment.services;
                    servicesCount = servicesCount + services.length;
                    totalSpend += services.reduce(
                        (sum: number, service: any) => (service.price ?? 0),
                        0
                    );
                }

                delete customer.appointments;
                delete customer.services;
                delete customer.location;
                return {
                    ...customer,
                    total_spend: totalSpend,
                    last_visit: lastVisit,
                    appointments_count: appointments.length,
                    services_count: servicesCount,
                }
            })
            return formattedResponse;
        } catch (error) {
            throw new AppErrors(error);
        }

    }

    static async getAllAppointments(data: any): Promise<Appointment[]> {

        try {

            let whereClause: any = {};

            if (data.status) {
                whereClause.status = data.status;
            }
            if (data.gender) {
                whereClause.gender = data.gender;
            }

            if (data.date_range) {
                const [startDate, endDate] = data.date_range.split(":");
                whereClause.appointment_date = {
                    [Op.between]: [
                        HelperFunctions.startOfDay(startDate),
                        HelperFunctions.endOfDay(endDate)
                    ],
                };
            }

            const appointments = await Appointment.findAll({
                include: [
                    {
                        model: User,
                        as: "customer",
                        attributes: ['id', 'first_name', "last_name",]
                    },
                    {
                        model: Shop,
                        as: "shop",
                        attributes: ['id', 'shop_name',]
                    },

                    {
                        model: AppointmentService,
                        as: "services",

                        include: [
                            {
                                model: Service,
                                as: "service",
                                attributes: ["id", "name", "price", "duration"], // choose fields
                            },
                        ],
                    },
                ],
                where: whereClause
                // attributes: ['id', 'appointment_date', 'status', 'shop_id', 'customer_id', 'barber_id',]
            });

            const formattedResponse = appointments.map((aptInstance) => {

                const appointementsInstance = aptInstance.get({ plain: true }) as any;
                const shopName = appointementsInstance.shop.shop_name;
                const customerName = `${appointementsInstance.customer.first_name} ${appointementsInstance.customer.last_name}`

                const serviceInstance = appointementsInstance.services;

                let serviceList = [];
                for (const service of serviceInstance) {
                    serviceList.push({ id: service.service.id, name: service.service.name });
                }
                delete appointementsInstance.shop;
                delete appointementsInstance.customer;
                delete appointementsInstance.services;
                return {
                    ...appointementsInstance,
                    customer_name: customerName,
                    shop_name: shopName,
                    services: serviceList,
                    services_count: serviceList.length,
                }
            })
            return formattedResponse;
        } catch (error: any) {
            throw new AppErrors(error.message);
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