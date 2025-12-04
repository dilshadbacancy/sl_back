

import * as z from "zod";
import { Status } from "../../utils/enum.utils";

export const UpdateStatusDto = z.object(
    {
        user_id: z.string({ error: "User id is required" }),
        status: z.enum(Status)
    }
)