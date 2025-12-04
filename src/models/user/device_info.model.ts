import { DataTypes, Model, Sequelize } from "sequelize";
import { BrowserType, DeviceType, Platform, Roles } from "../../utils/enum.utils";
import { SequelizeConnection } from "../../config/database.config";


interface DeviceInfoAttributes {
    device_name: string;
    device_model: string;
    device_type: DeviceType
    device_id: string;
    ip_address: string;
    last_active_at: Date;
    brand: string;
    os: string;
    build_number: string;
}

export interface PlatformInfoAttributes {
    name: Platform;
    version?: string;
    browser?: BrowserType
}

export class DeviceInfo extends Model {
    id!: string;
    user_id!: string;
    role!: Roles
    device_info!: DeviceInfoAttributes;
    platform_info!: PlatformInfoAttributes
}

const sequelize = SequelizeConnection.getInstance();

DeviceInfo.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        }
        ,
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(...Object.values(Roles)),
            allowNull: false,
        },
        device_info: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        platform_info: {
            type: DataTypes.JSON,
            allowNull: false,
        }
    }, {
    sequelize,
    tableName: "device-info",
    timestamps: true,
}
)