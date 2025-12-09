import z from "zod";
import { AppointmentStatus, Gender, PaymentMode, PaymentStatus } from "../../utils/enum.utils";


export const NearByShops = z.object({
    latitude: z.number({ error: "Latitude cannot be null or empty" }),
    longitude: z.number({ error: "Longitude cannot be null or Empty" }),
    radius: z.number().default(5).optional()
})





export const CreateAppointmentSchema = z.object({
    customer_id: z.string().uuid("Invalid customer_id"),
    shop_id: z.string().uuid("Invalid shop_id"),
    appointment_date: z.string().refine(
        (val) => !isNaN(Date.parse(val)),
        "Invalid appointment_date, must be a valid ISO date string"
    ),
    gender: z.enum(Gender, {
        message: "Gender must be one of male, female, unisex, others"
    }),
    notes: z.string().optional(),
    payment_mode: z.enum(PaymentMode, { message: "Invalid payment_mode" }),
    services: z.array(
        z.object({
            service_id: z.string().uuid("Invalid service_id"),
            duration: z.number().min(1, "Duration must be at least 1 minute"),
            price: z.number().min(0, "Price cannot be negative"),
            discounted_price: z.number().optional()
        })
    ).min(1, "At least one service must be selected")
}).strict();


export const ChangeAppointmentStatus = z.object({
    id: z.string().uuid("Appointment id is required"),
    status: z.enum(AppointmentStatus),
    remark: z.string().optional(),
})
    .superRefine((data, ctx) => {
        if (
            (data.status === AppointmentStatus.Rejected ||
                data.status === AppointmentStatus.Cancelled)
            && !data.remark
        ) {
            ctx.addIssue({
                path: ["remark"],
                code: z.ZodIssueCode.custom,
                message: "Remark is required when rejecting or cancelling an appointment",
            });
        }
    })
    .strict();
