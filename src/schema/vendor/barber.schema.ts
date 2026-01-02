import * as z from "zod";
import { Gender, Status } from "../../utils/enum.utils";


export const BarberSchema = z.object({
    user_id: z.string({ message: "User ID is required" }),
    shop_id: z.string({ message: "Shop ID is required" }),
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email").optional(),
    mobile: z
        .string()
        .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
    role: z.string().optional(),
    age: z.number().int().positive().optional(),
    gender: z.enum(Object.values(Gender)),
    specialist_in: z.array(z.string()).optional(),
    status: z.enum(Object.values(Status)).optional(),
}).strict();



export const BarberAvailabilitySchema = z.object(
    {
        id: z.string({ error: "Id is required" }),
        available: z.boolean({ error: "availabilty is required" })
    }
).strict()