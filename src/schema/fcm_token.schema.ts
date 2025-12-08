import { z } from "zod";
import { TokenType } from "../utils/enum.utils";



export const CreateFCMRecordSchema = z.object({
    user_id: z.string().uuid("Invalid user_id"),
    device_id: z.string().uuid("Invalid device_id"),
    token: z.object({
        type: z.enum(TokenType),
        token: z.string().min(1, "FCM token cannot be empty"),
    }).strict()
}).strict();

