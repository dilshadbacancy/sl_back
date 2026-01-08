
import { z } from "zod";

export const UpdateAdminUserSchema = z.object({
    id: z
        .string()
        .trim()
        .min(1, "User id cannot be null or empty"),

    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .optional(),

    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .optional(),

    mobile: z
        .string()
        .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits")
        .optional(),
});
