import { Model, DataTypes } from "sequelize";
import { SequelizeConnection } from "../../config/database.config";

export class ShopBankDetails extends Model {
    id!: string;
    shop_id!: string;
    user_id!: string;
    bank_name!: string | null;
    account_number!: string | null;
    ifsc_code!: string | null;
    account_holder_name!: string | null;
}

const sequelize = SequelizeConnection.getInstance();

ShopBankDetails.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        shop_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        bank_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        account_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        ifsc_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        account_holder_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "shop_bank",
        timestamps: true,
    }
);

export default ShopBankDetails;
