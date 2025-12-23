import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../../config/database.config";

export class ShopKycDetail extends Model {
    id!: string;
    shop_id!: string;
    user_id!: string;
    aadhar_number!: string | null;
    pan_number!: string | null;
    aadhar_front!: string | null;
    aadhar_back!: string | null;
    pan_card!: string | null;
    shop_license!: string | null;
    is_verified!: boolean;
}

const sequelize = SequelizeConnection.getInstance();

ShopKycDetail.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        shop_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        aadhar_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        pan_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        aadhar_front: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        aadhar_back: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        pan_card: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        shop_license: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "shop_kyc",
        timestamps: true,
    }
);
