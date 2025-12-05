
import { z } from "zod";
import { Gender } from "../../utils/enum.utils";


export const CreateServiceSchema = z.object({
    id: z.string().uuid().optional(),     // optional if auto-generated
    name: z.string().min(1, "Name is required"),
    description: z.string().nullable().optional(),
    duration: z.number().positive("Duration must be a positive number"),
    price: z.number().positive("Price must be a positive number"),
    discounted_price: z.number().positive().nullable().optional(),
    gender: z.enum(Gender),
    category: z.string().min(1, "Category is required"),
    is_active: z.boolean().default(true),
    image_url: z.string().url().nullable().optional(),
});

