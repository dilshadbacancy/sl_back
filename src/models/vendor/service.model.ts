import { Gender } from "../../utils/enum.utils";
import { SequelizeConnection } from "../../config/database.config";
import { DataTypes, Model } from "sequelize";



export class Service extends Model {
    id!: string;
    name!: string;
    shop_id!: string;
    description!: string | null;
    duration!: number;
    price!: number;
    discounted_price!: number | null;
    gender!: Gender;
    category!: string;
    is_active!: boolean;
    image_url!: string | null;
}

const sequelize = SequelizeConnection.getInstance();

Service.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },

        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        shop_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },

        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            }
        },

        discounted_price: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0,
            }
        },

        gender: {
            type: DataTypes.ENUM(...Object.values(Gender)),
            allowNull: false,
        },

        category: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },

        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },

    {
        sequelize,
        tableName: "service",
        timestamps: true,
    }
);

export default Service;
