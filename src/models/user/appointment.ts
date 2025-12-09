import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../../config/database.config";
import { AppointmentStatus, Gender, PaymentMode, PaymentStatus } from "../../utils/enum.utils";

export class Appointment extends Model {
    id!: string;
    customer_id!: string;
    shop_id!: string;
    barber_id!: string | null;

    booking_time!: Date;
    appointment_date!: Date;
    expected_start_time!: Date | null;
    expected_end_time!: Date | null;
    service_completed_at!: Date | null
    service_duration!: number | null;
    extra_duration!: number | null;

    pin!: number | null;
    gender!: Gender;
    status!: AppointmentStatus;
    notes!: string | null;

    payment_status!: PaymentStatus;
    payment_mode!: PaymentMode;
    remark!: string | null;
}

const sequelize = SequelizeConnection.getInstance();

Appointment.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        customer_id: { type: DataTypes.UUID, allowNull: false },
        shop_id: { type: DataTypes.UUID, allowNull: false },
        barber_id: { type: DataTypes.UUID, allowNull: true },
        booking_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        appointment_date: { type: DataTypes.DATE, allowNull: false },
        expected_start_time: { type: DataTypes.DATE, allowNull: true },
        expected_end_time: { type: DataTypes.DATE, allowNull: true },
        service_completed_at: { type: DataTypes.DATE, allowNull: true },
        service_duration: { type: DataTypes.INTEGER, allowNull: true },
        extra_duration: { type: DataTypes.INTEGER, allowNull: true },
        pin: { type: DataTypes.INTEGER, allowNull: false },
        gender: { type: DataTypes.ENUM(...Object.values(Gender)), allowNull: false },
        status: { type: DataTypes.ENUM(...Object.values(AppointmentStatus)), defaultValue: AppointmentStatus.Pending },
        notes: { type: DataTypes.TEXT, allowNull: true },
        payment_status: { type: DataTypes.ENUM(...Object.values(PaymentStatus)), defaultValue: PaymentStatus.Pending },
        payment_mode: { type: DataTypes.ENUM(...Object.values(PaymentMode)), allowNull: false },
        remark: { type: DataTypes.STRING, allowNull: true }
    },
    { sequelize, tableName: "appointments", timestamps: true }
);

