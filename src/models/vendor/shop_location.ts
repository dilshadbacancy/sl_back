import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../../config/database.config";

export class ShopLocation extends Model {
    id!: string;
    shop_id!: string;
    user_id!: string;
    address_line1!: string;
    address_line2!: string | null;
    area!: string;
    city!: string;
    state!: string;
    country!: string;
    pincode!: string;
    latitude!: number;
    longitude!: number;
}

const sequelize = SequelizeConnection.getInstance();

ShopLocation.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },

        shop_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        address_line1: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        address_line2: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        area: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },

        city: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },

        state: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },

        country: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },

        pincode: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                isNumeric: true,
                len: [6, 10],
            },
        },

        latitude: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: false,
        },

        longitude: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "shop_location",
        timestamps: true,
    }
);
