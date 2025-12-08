import z from "zod";


export const NearByShops = z.object({
    latitude: z.number({ error: "Latitude cannot be null or empty" }),
    longitude: z.number({ error: "Longitude cannot be null or Empty" }),
    radius: z.number().default(5).optional()
})