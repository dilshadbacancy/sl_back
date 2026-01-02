import { DataTypes, Model } from "sequelize";
import { Gender, Roles, ScreenSteps, Status } from "../../utils/enum.utils";
import { SequelizeConnection } from "../../config/database.config";


interface UserLocationDetails {
    country: string | "INDIA"
    state: string;
    city: string,
    landmark: string;
    latitude: string;
    longitude: string;
}

export class User extends Model {
    id!: string;
    first_name!: string;
    last_name!: string;
    mobile!: string;
    email!: string;
    location!: UserLocationDetails
    role!: Roles;
    gender!: Gender;
    is_verified!: boolean;
    is_onboarding_completed!: boolean;
    created_at!: Date;
    updated_at!: Date;
    status!: Status
    route!: ScreenSteps;

}


const sequelize = SequelizeConnection.getInstance()
    ;
User.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: true,

        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: true,

        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: true,

        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,

        },
        location: {
            type: DataTypes.JSON,
            allowNull: true,

        },
        role: {
            type: DataTypes.ENUM(...Object.values(Roles)),
            allowNull: true,
            defaultValue: Roles.CUSTOMER,

        },
        gender: {
            type: DataTypes.ENUM(...Object.values(Gender)),
            allowNull: true,
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_onboarding_completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(Status)),
            defaultValue: Status.ACTIVE,
            allowNull: false,
        },
        route: {
            type: DataTypes.ENUM(...Object.values(ScreenSteps)),
            defaultValue: ScreenSteps.INITIAL_SCREEN,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: "users",
        timestamps: true,
    }
)