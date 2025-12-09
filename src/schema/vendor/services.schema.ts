
import { z } from "zod";
import { Gender } from "../../utils/enum.utils";


export const CreateServiceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    shop_id: z.string({ error: "Shop id is required" }),
    description: z.string().nullable().optional(),
    duration: z.number().positive("Duration must be a positive number"),
    price: z.number().positive("Price must be a positive number"),
    discounted_price: z.number().positive().nullable().optional(),
    gender: z.enum(Gender),
    category: z.string().min(1, "Category is required"),
    is_active: z.boolean().default(true),
    image_url: z.string().url().nullable().optional(),
}).strict();


export const AddServiceToShopSchema = z.object({
    shop_id: z.string().nonempty({ error: "Shop id is required" }),
    services: z.array(z.string()).nonempty("At least one service is required"),
}).strict()

export const UpdateServiceOfShop = z.object({
    id: z.string().uuid(),
    name: z.string()
        .min(3, "Name must be at least 3 characters")
        .optional(),

    description: z.string().optional(),

    duration: z.preprocess(v => Number(v), z.number().positive("Duration must be a positive number"))
        .optional(),

    price: z.preprocess(v => Number(v), z.number().positive("Price must be a positive number"))
        .optional(),

    discounted_price: z.preprocess(v => Number(v), z.number().positive()).optional(),

    gender: z.enum(Gender).optional(),

    category: z.string().min(1, "Category is required").optional(),

    is_active: z.preprocess(v => v === "true" || v === true, z.boolean()).optional(),

    image_url: z.string().url().optional(),
}).strict();

