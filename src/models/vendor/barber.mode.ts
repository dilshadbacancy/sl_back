import { DataTypes, Model } from "sequelize";
import { Gender, Roles, Status } from "../../utils/enum.utils";
import { SequelizeConnection } from "../../config/database.config";

export class Barber extends Model {
    id!: string;
    user_id!: string;
    shop_id!: string;
    name!: string;
    email: string | undefined;
    mobile!: string;
    role!: Roles;
    age: number | undefined;
    gender!: Gender;
    specialist_in: string[] | undefined;
    status!: Status;
    available!: boolean;
    username!: string;
    login_pin!: number
}

const sequelize = SequelizeConnection.getInstance();
Barber.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        shop_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(...Object.values(Roles)),
            defaultValue: Roles.BARBER,
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        gender: {
            type: DataTypes.ENUM(...Object.values(Gender)),
            allowNull: false,
        },
        specialist_in: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(Status)),
            allowNull: false,
            defaultValue: Status.ACTIVE,
        },
        available: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        login_pin: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: "barber",
        timestamps: true
    }
)