import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../../config/database.config";

export class BarberAttandence extends Model {
    id!: string;
    user_id!: string;
    shop_id!: string;
    barber_id!: string;
    in_time!: Date;
    out_time: Date | undefined;
    latitude!: string;
    longitude!: string;
}

const sequelize = SequelizeConnection.getInstance();

BarberAttandence.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        shop_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        barber_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        in_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        out_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        latitude: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.STRING,
            allowNull: false,
        }


    },
    {
        sequelize,
        tableName: "barber_attandence",
        timestamps: true,
    }
)