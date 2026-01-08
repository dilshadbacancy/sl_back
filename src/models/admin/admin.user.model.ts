import { DataTypes, Model } from "sequelize";
import { AdminRole } from "../../utils/enum.utils";
import { SequelizeConnection } from "../../config/database.config";

export class AdminUserModel extends Model {
    id!: string;
    name!: string;
    email!: string;
    mobile!: string;
    role!: AdminRole;
    password!: string;
    mustResetPassword!: boolean;
}


const sequelize = SequelizeConnection.getInstance();

AdminUserModel.init({

    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    mobile: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM(...Object.values(AdminRole)),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mustResetPassword: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }

}, {
    sequelize,
    tableName: "admin-users",
    createdAt: true
})