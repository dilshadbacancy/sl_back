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

const VendorServiceSchema = z.object({
    name: z.string().min(1, "Service name is required"),
    price: z.number().positive().optional(),
    duration_minutes: z.number().positive().optional(),
    category: z.string().optional(),
    is_active: z.boolean().optional().default(true),
});

export const VendorServicesUpdateSchema = z.object({
    id: z.string().uuid("Invalid vendor ID"),
    services: z.array(VendorServiceSchema).nonempty("At least one service is required"),
});



export const VendorKYCDetailsSchema = z.object(
    {
        id: z.string({ error: "Id is required" }),
        kyc_details: z.object({
            aadhar_number: z
                .string()
                .nullable()
                .optional()
                .refine((val) => !val || /^[0-9]{12}$/.test(val), {
                    message: "Aadhar number must be 12 digits",
                }),

            pan_number: z
                .string()
                .nullable()
                .optional()
                .refine((val) => !val || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val), {
                    message: "Invalid PAN number format",
                }),

            document_urls: z.object({
                aadhar_front: z.string().url("Invalid URL").nullable().optional(),
                aadhar_back: z.string().url("Invalid URL").nullable().optional(),
                pan_card: z.string().url("Invalid URL").nullable().optional(),
                shop_license: z.string().url("Invalid URL").nullable().optional(),
            }),
        })
    }
)


export const VendorBankDetailSchema = z.object({
    id: z.string({ error: "Id is required" }),
    bank_details: z.object({
        bank_name: z.string().nullable().optional(),
        account_number: z
            .string()
            .nullable()
            .optional()
            .refine((val) => !val || /^[0-9]{9,18}$/.test(val), {
                message: "Account number must be between 9 and 18 digits",
            }),
        ifsc_code: z
            .string()
            .nullable()
            .optional()
            .refine((val) => !val || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val), {
                message: "Invalid IFSC code format",
            }),
        account_holder_name: z.string().nullable().optional(),
    })
})