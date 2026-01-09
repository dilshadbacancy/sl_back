import { z } from "zod";
import { AppointmentStatus, Gender, Status } from "../../utils/enum.utils";


export const AdminShopFilterSchema = z.object({
    status: z.enum(Status).nullish(),
    isVerified: z.boolean().nullish(),
})

export const AdminAppointmentsFilterSchema = z.object({
    status: z
        .enum(AppointmentStatus)
        .optional()
        .nullable(),

    gender: z
        .enum(Gender)
        .optional()
        .nullable(),

    date_range: z
        .string()
        .optional()
        .nullable()
        .refine(
            (val) =>
                !val ||
                /^\d{4}-\d{2}-\d{2}$/.test(val) ||                     // single date
                /^\d{4}-\d{2}-\d{2}:\d{4}-\d{2}-\d{2}$/.test(val),     // date range
            {
                message:
                    "date_range must be YYYY-MM-DD or YYYY-MM-DD:YYYY-MM-DD",
            }
        ).transform((val) => {
            if (!val || val === "") return undefined;

            // Single date → convert to range
            if (!val.includes(":")) {
                return `${val}:${val}`;
            }

            // Already a range
            return val;
        }),

});


export const AdminCustomerFilterSchema = z.object({
    gender: z.enum(Gender).nullish(),
    status: z.enum(Status).nullish(),
})