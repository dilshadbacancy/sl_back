import { AppErrors } from "../../errors/app.errors";
import { Appointment } from "../../models/user/appointment";
import { Shop } from "../../models/vendor/shop.model";
import { ShopLocation } from "../../models/vendor/shop_location";
import { literal, Op, Transaction } from "sequelize";
import { AppointmentStatus, PaymentStatus } from "../../utils/enum.utils";
import { da } from "zod/v4/locales";
import { SequelizeConnection } from "../../config/database.config";
import { Barber } from "../../models/vendor/barber.mode";
import { HelperUtils } from "../../utils/helper";
import { User } from "../../models/user/user.model";
import Service from "../../models/vendor/service.model";
import { AppointmentService } from "../../models/vendor/appointment_service.model";
import { boolean, includes } from "zod";

export class CustomerServies {
    static async fetchNearByShops(data: any): Promise<any> {
        const { latitude, longitude, radius = 5 } = data;

        const distance = `
        ROUND(
            (6371 * acos(
                cos(radians(${latitude})) *
                cos(radians(location.latitude)) *
                cos(radians(location.longitude) - radians(${longitude})) +
                sin(radians(${latitude})) *
                sin(radians(location.latitude))
            ))
        , 3)
    `;

        const shops = await Shop.findAll({
            include: [
                {
                    model: ShopLocation,
                    as: "location",
                }
            ],
            attributes: {
                include: [[literal(distance,), "distance"]]
            },
            where: literal(`${distance} <= ${radius}`),
            order: literal(`distance ASC`)
        });

        const formatted = shops.map(shop => {
            const dist = Number(shop.dataValues.distance);

            if (dist < 1) {
                const meters = Math.round(dist * 1000);
                shop.dataValues.distance = `${meters} m`;
            } else {
                shop.dataValues.distance = `${dist} km`;
            }

            return shop;
        });
        return formatted;
    }


    static async createAppointment(data: any) {
        if (!data.services || data.services.length === 0) throw new AppErrors("At least one service is required");

        // Calculate total duration and total price
        let totalDuration = 0;
        let totalPrice = 0;
        data.services.forEach((s: any) => {
            totalDuration += s.duration;
            totalPrice += s.price;
        });

        const pin = HelperUtils.generateOTP();

        // Create appointment
        const appointment = await Appointment.create({
            customer_id: data.customer_id,
            shop_id: data.shop_id,
            barber_id: data.barber_id ?? null,
            appointment_date: data.appointment_date,
            gender: data.gender,
            status: AppointmentStatus.Pending,
            notes: data.notes,
            payment_mode: data.payment_mode,
            service_duration: totalDuration,
            pin
        });

        // Save each service in appointment_services
        for (const s of data.services) {
            await AppointmentService.create({
                appointment_id: appointment.id,
                service_id: s.service_id,
                duration: s.duration,
                price: s.price,
                discounted_price: s.discounted_price,
            });
        }

        return appointment;
    }


    static async assignBarber(
        appointmentId: string,
        barberId?: string,
        extraDuration?: number
    ) {
        const appointment = await Appointment.findByPk(appointmentId);
        if (!appointment) throw new AppErrors("Appointment not found");

        const shopId = appointment.shop_id;

        const totalDuration = (appointment.service_duration ?? 0) + (extraDuration ?? 0);

        let assignedBarber: any;
        let expectedStart: Date;

        // 1. Manual barber assignment if barberId provided
        if (barberId) {
            assignedBarber = await Barber.findOne({ where: { id: barberId, shop_id: shopId } });
            if (!assignedBarber) throw new AppErrors("Barber not found");

            // Check if barber is available now
            if (assignedBarber.available) {
                expectedStart = new Date();
            } else {
                // Get barber's latest appointment end time
                const lastAppt = await Appointment.findOne({
                    where: {
                        barber_id: barberId,
                        status: { [Op.in]: ["inProgress", "accepted"] },
                        appointment_date: appointment.appointment_date
                    },
                    order: [["expected_end_time", "DESC"]]
                });
                expectedStart = lastAppt ? new Date(lastAppt.expected_end_time!) : new Date();
            }
        } else {
            // 2. Auto-assign: check for any available barber first
            assignedBarber = await Barber.findOne({ where: { shop_id: shopId, available: true } });

            if (assignedBarber) {
                expectedStart = new Date();
            } else {
                // If no barber is currently available, find barber who gets free earliest
                const barbers = await Barber.findAll({ where: { shop_id: shopId } });
                let earliestTime = new Date(Date.now() + 1000 * 60 * 24 * 365); // far future

                for (const barber of barbers) {
                    const lastAppt = await Appointment.findOne({
                        where: {
                            barber_id: barber.id,
                            status: { [Op.in]: ["inProgress", "accepted"] },
                            appointment_date: appointment.appointment_date
                        },
                        order: [["expected_end_time", "DESC"]]
                    });
                    const freeAt = lastAppt ? new Date(lastAppt.expected_end_time!) : new Date();
                    if (freeAt < earliestTime) {
                        earliestTime = freeAt;
                        assignedBarber = barber;
                    }
                }

                expectedStart = earliestTime;
            }
        }

        const expectedEnd = new Date(expectedStart.getTime() + totalDuration * 60 * 1000);


        /// Update barber 
        if (assignedBarber.available) {
            await assignedBarber.update({ available: false });
        }

        // 3. Update appointment
        await appointment.update({
            barber_id: assignedBarber.id,
            expected_start_time: expectedStart,
            expected_end_time: expectedEnd,
            status: AppointmentStatus.Accepted,
            extra_duration: extraDuration ?? 0
        });

        return {
            ...appointment.toJSON(),
            total_service_duration: totalDuration
        };
    }

    static async getAllAppointments(
        status?: AppointmentStatus,
        shop_id?: string,
        user_id?: string
    ): Promise<any[]> {
        const whereClause: any = {};

        if (status) whereClause.status = status;
        if (shop_id) whereClause.shop_id = shop_id;
        if (user_id) whereClause.customer_id = user_id;

        const appointments = await Appointment.findAll({
            where: whereClause,
            include: [
                {
                    model: AppointmentService,
                    as: "services",
                    include: [{ model: Service, as: "service" }]
                },
                { model: Barber, as: "barber" },
                { model: Shop, as: "shop" },
                { model: User, as: "customer" }
            ],
            order: [
                ["appointment_date", "ASC"],
                ["expected_start_time", "ASC"]
            ]
        });

        // Defensive formatting
        const formatted = appointments.map((apptInstance) => {
            const appt = apptInstance.get({ plain: true }) as any;

            // Services: map to small objects; handle missing nested service
            const services = Array.isArray(appt.services)
                ? appt.services.map((as: any) => ({
                    id: as.service_id ?? as.id, // fallback if structure differs
                    appointment_service_id: as.id,
                    name: as.service?.name ?? null,
                    duration: as.duration ?? as.service?.duration ?? null,
                    price: as.price ?? as.service?.price ?? null,
                    description: as.service?.description ?? null,
                    image_url: as.service?.image_url ?? null
                }))
                : [];

            // Barber
            const barber = appt.barber
                ? {
                    id: appt.barber.id,
                    name: appt.barber.name ?? null,
                    email: appt.barber.email ?? null,
                    mobile: appt.barber.mobile ?? null,
                    specialist_in: appt.barber.specialist_in ?? [],
                    available: !!appt.barber.available
                }
                : null;

            // Shop
            const shop = appt.shop
                ? {
                    id: appt.shop.id,
                    shop_name: appt.shop.shop_name ?? null,
                    shop_logo_url: appt.shop.shop_logo_url ?? null,
                    email: appt.shop.email ?? null,
                    mobile: appt.shop.mobile ?? null,
                    shop_open_time: appt.shop.shop_open_time ?? null,
                    shop_close_time: appt.shop.shop_close_time ?? null
                }
                : null;

            // Customer
            const customer = appt.customer
                ? {
                    id: appt.customer.id,
                    first_name: appt.customer.first_name ?? appt.customer.name ?? null,
                    last_name: appt.customer.last_name ?? null,
                    email: appt.customer.email ?? null,
                    mobile: appt.customer.mobile ?? null
                }
                : null;

            return {
                id: appt.id,
                booking_time: appt.booking_time ?? null,
                appointment_date: appt.appointment_date ?? null,
                expected_start_time: appt.expected_start_time ?? null,
                expected_end_time: appt.expected_end_time ?? null,
                service_duration: appt.service_duration ?? null,
                extra_duration: appt.extra_duration ?? null,
                total_service_duration: appt.extra_duration + appt.service_duration,
                gender: appt.gender ?? null,
                status: appt.status ?? null,
                notes: appt.notes ?? null,
                payment_status: appt.payment_status ?? null,
                payment_mode: appt.payment_mode ?? null,
                service_count: services.length,

                services,
                barber,
                shop,
                customer
            };
        });

        return formatted;
    }


    static async changeAppointmentStatus(data: any): Promise<any> {
        const status = data.status as AppointmentStatus;

        const appointment = await Appointment.findOne({
            where: { id: data.id },
            include: [
                {
                    model: AppointmentService,
                    as: "services",
                    include: [{ model: Service, as: "service" }]
                }
            ]
        });

        if (!appointment) {
            throw new AppErrors("No appointment has been found");
        }

        // ---- VALIDATIONS ----


        const currentStatus = appointment.status;

        if (currentStatus == AppointmentStatus.Rejected) {
            throw new AppErrors("Rejected appointments cannot be change, Please check other appointments")
        }

        if (currentStatus === AppointmentStatus.Cancelled) {
            throw new AppErrors("Cancelled appointments cannot be change, Please take an appointment again")
        }

        if (currentStatus === AppointmentStatus.Accepted && status === AppointmentStatus.Rejected) {
            throw new AppErrors("You cannot reject an appointment once it is accepted");
        }

        if (currentStatus === AppointmentStatus.InProgress && status === AppointmentStatus.Cancelled) {
            throw new AppErrors("You cannot cancel ongoing appointments");
        }

        if (currentStatus === AppointmentStatus.Conmpleted && status !== AppointmentStatus.Conmpleted) {
            throw new AppErrors("Completed appointments cannot be changed");
        }

        let dataToUpdate: any = { status };
        let totalPrice = 0;
        let discountAmt = 0;
        let services: any[] = [];

        // ---- CALCULATE ONLY IF COMPLETED ----
        if (status === AppointmentStatus.Conmpleted) {
            dataToUpdate.service_completed_at = new Date();
            dataToUpdate.payment_status = PaymentStatus.Success;

            const appt = appointment.get({ plain: true }) as any;

            const serviceList = Array.isArray(appt.services) ? appt.services : [];

            // TOTAL PRICE
            totalPrice = serviceList.reduce(
                (sum: number, s: any) => sum + (s.service?.price ?? 0),
                0
            );

            // DISCOUNTED PRICE
            discountAmt = serviceList.reduce(
                (sum: number, s: any) => sum + (s.service?.discounted_price ?? 0),
                0
            );

            // SERVICE DETAILS (clean)
            services = serviceList.map((as: any) => ({
                id: as.service?.id,
                name: as.service?.name,
                description: as.service?.description ?? null,
                image_url: as.service?.image_url ?? null,
                price: as.service.price,
                discount_price: as.service.discounted_price,
            }));
        }

        // ---- UPDATE APPOINTMENT ----
        await appointment.update(dataToUpdate);

        return {
            message: "Appointment status changed",
            status: appointment.status,
            total_price: totalPrice,
            discount: discountAmt,
            chargeable_amount: totalPrice - discountAmt,
            appointment_id: appointment.id,
            shop_id: appointment.shop_id,
            customer_id: appointment.customer_id,
            barber_id: appointment.barber_id,
            service_count: services.length,
            services
        };
    }


}
