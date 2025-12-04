import { DataTypes, Model, Sequelize } from "sequelize";
import { SequelizeConnection } from "../config/database.config";
import { TokenType } from "../utils/enum.utils";

interface FCMAttributes {
    type: TokenType
    token: string;
}

export class FCM extends Model {
    id!: string;
    user_id!: string;
    device_id!: string;
    token!: FCMAttributes;
}

const sequelize = SequelizeConnection.getInstance();

FCM.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        device_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        token: {
            type: DataTypes.JSON,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "fcm-records",
        timestamps: true,
    }
);
