import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../../config/database.config";

export class AppointmentService extends Model {
    id!: string;
    appointment_id!: string;
    service_id!: string;
    duration!: number;
    price!: number;
    discounted_price!: number;
}

const sequelize = SequelizeConnection.getInstance();

AppointmentService.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        appointment_id: { type: DataTypes.UUID, allowNull: false },
        service_id: { type: DataTypes.UUID, allowNull: false },
        duration: { type: DataTypes.INTEGER, allowNull: false },
        price: { type: DataTypes.INTEGER, allowNull: false },
        discounted_price: { type: DataTypes.INTEGER, allowNull: true }
    },
    {
        sequelize,
        tableName: "appointment_services",
        timestamps: true,
    }
);


