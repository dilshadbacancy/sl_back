import { Shop } from "../../models/vendor/shop.model";
import { ShopLocation } from "../../models/vendor/shop_location";
import { literal } from "sequelize";

export class CustomerServies {
    static async fetchNearByShops(data: any): Promise<any> {
        const { latitude, longitude, radius = 5 } = data;

        const distance = `
        ROUND(
            (6371 * acos(
                cos(radians(${latitude})) *
                cos(radians(location.latitude)) *
                cos(radians(location.longitude) - radians(${longitude})) +
                sin(radians(${latitude})) *
                sin(radians(location.latitude))
            ))
        , 3)
    `;

        const shops = await Shop.findAll({
            include: [
                {
                    model: ShopLocation,
                    as: "location",
                }
            ],
            attributes: {
                include: [[literal(distance,), "distance"]]
            },
            where: literal(`${distance} <= ${radius}`),
            order: literal(`distance ASC`)
        });

        const formatted = shops.map(shop => {
            const dist = Number(shop.dataValues.distance);

            if (dist < 1) {
                const meters = Math.round(dist * 1000);
                shop.dataValues.distance = `${meters} m`;
            } else {
                shop.dataValues.distance = `${dist} km`;
            }

            return shop;
        });
        return formatted;
    }
}
