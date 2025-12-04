import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../../config/database.config";
import { fa } from "zod/v4/locales";
import { Roles } from "../../utils/enum.utils";

export class RefreshToken extends Model {
    id!: string;
    token!: string;
    user_id!: string;
    is_revoked!: boolean;
    role!: string;
    expire_at!: Date;
}

const sequelize = SequelizeConnection.getInstance();


RefreshToken.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_revoked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(...Object.values(Roles)),
            allowNull: false,
        },
        expire_at: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: "refresh-tokens",
        timestamps: true,
    }
)