
import * as z from "zod";

export const UpdateLocationDto = z.object(
    {
        latitude: z.string({ error: "Latitude cannot be null or empty" }),
        longitude: z.string({ error: "Longitude cannot be null or Empty" }),
        user_id: z.string("User id cannot be null or empty")
    }
).strict()