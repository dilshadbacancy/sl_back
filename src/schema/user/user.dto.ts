import * as z from "zod";
import { Gender, Roles } from "../../utils/enum.utils";

export const CreateUserDto = z.object(
    {
        user_id: z.string().optional(),
        first_name: z.string({ error: "First name is required" }),
        last_name: z.string({ error: "Last name is required" }),
        email: z.string({ error: "Email is required" }).email(),
        location: z.object(
            {
                country: z.string({ error: "Country is required" }),
                state: z.string({ error: "State is required" }),
                city: z.string({ error: "City is required" }),
                landmark: z.string().optional(),
                latitude: z.string({ error: "Latitude is required" }),
                longitude: z.string({ error: "Longitude is required" }),
            }
        ).strict(),
        is_profile_completed: z.boolean({ error: "this is required" }),
        gender: z.enum(Object.values(Gender), { error: "Gender is required" }),
    }
).strict()



export const SendOtpSchema = z.object(
    {
        mobile: z.string({ error: "Mobile number is required" }).length(10, { message: "Mobile number must be 10 digits" }),
        role: z.enum(Object.values(Roles), { error: "Role is required" }),
    }
)