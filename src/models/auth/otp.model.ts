import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../../config/database.config";

export class OTP extends Model {
    id!: string;
    code!: string;
    mobile!: string;
    isVerified!: string;
    user_id!: string;
    expire_at!: Date
    role!: string
}

const sequelize = SequelizeConnection.getInstance();
OTP.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Code cannot be empty"
                },
                notNull: {
                    msg: "Code cannot be Null"
                }
            }
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Code cannot be empty"
                },
                notNull: {
                    msg: "Code cannot be Null"
                }
            }
        },
        isVerified: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: true,

        },
        expire_at: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    },
    {
        sequelize,
        tableName: "otp-records",
        timestamps: true,
    }
)