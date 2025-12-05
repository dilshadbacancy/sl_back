import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../../config/database.config";

export class Shop extends Model {
    id!: string;
    shop_name!: string;
    user_id!: string;
    shop_logo_url!: string | null;
    shop_banner_url!: string | null;
    gstin_number!: string | null;
    email!: string;
    mobile!: string;
    shop_open_time!: string | null;
    shop_close_time!: string | null;
    weekly_holiday!: string | null;
    services!: string[]
}

const sequelize = SequelizeConnection.getInstance();

Shop.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },

        shop_name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        shop_logo_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        shop_banner_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        gstin_number: {
            type: DataTypes.STRING(15),
            allowNull: true,
            validate: {
                len: [15, 15],
            },
        },

        email: {
            type: DataTypes.STRING(120),
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },

        mobile: {
            type: DataTypes.STRING(15),
            allowNull: false,
            validate: {
                isNumeric: true,
                len: [10, 15],
            },
        },

        shop_open_time: {
            type: DataTypes.STRING(10), // example "09:00"
            allowNull: true,
        },

        shop_close_time: {
            type: DataTypes.STRING(10), // example "21:00"
            allowNull: true,
        },

        weekly_holiday: {
            type: DataTypes.STRING(20), // example "Sunday"
            allowNull: true,
        },
        services: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        }
    },

    {
        sequelize,
        tableName: "shops",
        timestamps: true,
    }
);
