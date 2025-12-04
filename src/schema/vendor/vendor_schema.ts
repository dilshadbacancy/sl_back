import { z } from "zod";



export const VendorShopDetailsSchema = z.object(
    {
        user_id: z.string({ error: "User id is required" }),
        shop_details: z.object({
            shop_name: z.string().min(1, "Shop name is required"),

            shop_logo_url: z.string().url("Invalid shop logo URL").nullable().optional(),
            shop_banner_url: z.string().url("Invalid shop banner URL").nullable().optional(),

            gstin_number: z
                .string()
                .regex(/^[0-9A-Z]{15}$/, "Invalid GSTIN format")
                .nullable()
                .optional(),

            email: z.email("Invalid shop email"),

            mobile: z
                .string()
                .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),

            shop_open_time: z.string().nullable().optional(),   // "09:00" or "9AM"
            shop_close_time: z.string().nullable().optional(),  // "21:00" or "9PM"

            weekly_holiday: z.string().nullable().optional(),   // "Sunday" etc.
        })
    }
)



export const VendorLocationDetailsSchema = z.object({
    id: z.string({ error: "id is required" }),
    location_details: z.object({
        address_line1: z
            .string()
            .min(1, "Address line 1 is required"),

        address_line2: z
            .string()
            .nullable()
            .optional(),

        area: z
            .string()
            .min(1, "Area is required"),

        city: z
            .string()
            .min(1, "City is required"),

        state: z
            .string()
            .min(1, "State is required"),

        country: z
            .string()
            .min(1, "Country is required"),

        pincode: z
            .string()
            .regex(/^[0-9]{6}$/, "Invalid pincode, must be 6 digits"),

        latitude: z
            .number()
            .nullable()
            .optional(),

        longitude: z
            .number()
            .nullable()
            .optional(),
    })
});
