import * as z from "zod";
import { Gender, Status } from "../../utils/enum.utils";
import { availableMemory } from "process";

export const BarberSchema = z.object({
    id: z.string().uuid("Invalid barber ID").optional(),

    user_id: z.string().uuid("User ID is required"),

    shop_id: z.string().uuid("Shop ID is required"),

    name: z.string().min(1, "Name is required"),

    email: z.string().email("Invalid email").optional().nullable(),

    mobile: z
        .string()
        .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),

    age: z.number().int().positive().optional().nullable(),

    gender: z.enum(Object.values(Gender) as [string, ...string[]]),

    specialist_in: z
        .array(z.string().min(1))
        .optional()
        .nullable(),
    status: z.enum(Status).optional().nullable()
});


export const BarberAvailabilitySchema = z.object(
    {
        id: z.string({ error: "Id is required" }),
        available: z.boolean({ error: "availabilty is required" })
    }
)