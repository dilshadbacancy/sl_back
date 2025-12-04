import { DataTypes, Model } from "sequelize";
import { Status } from "../../utils/enum.utils";
import { SequelizeConnection } from "../../config/database.config";
import { VendorService } from "../../service/vendor.service";


interface VendorShopDetailsAttributes {
    shop_name: string;
    shop_logo_url: string | null;
    shop_banner_url: string | null;
    gstin_number: string | null;
    email: string;
    mobile: string;
    shop_open_time: string | null;
    shop_close_time: string | null;
    weekly_holiday: string | null;
}


interface VendorServices {
    name: string;           // service name
    price: number;          // optional price
    duration_minutes: number; // optional duration
    category?: string;       // optional category like hair, spa, massage
    is_active?: boolean;     // optional flag to deactivate service
}

interface VendorLocationDetails {
    address_line1: string;
    address_line2: string | null;
    area: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    latitude: number | null;
    longitude: number | null;
}

interface VendorKYCDetails {
    aadhar_number: string | null;
    pan_number: string | null;
    document_urls: {
        aadhar_front?: string | null;
        aadhar_back?: string | null;
        pan_card?: string | null;
        shop_license?: string | null;
    };
}

interface VendorBankDetail {
    bank_name: string | null;
    account_number: string | null;
    ifsc_code: string | null;
    account_holder_name: string | null;
}

export class VendorModel extends Model {
    id!: string;
    user_id!: string;
    is_verified!: boolean;
    status!: Status;
    shop_details!: VendorShopDetailsAttributes;
    location_details!: VendorLocationDetails;
    services!: VendorServices
    kyc_details!: VendorKYCDetails;
    bank_details!: VendorBankDetail;
}

const sequelize = SequelizeConnection.getInstance();
VendorModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(Status)),
            allowNull: false,
            defaultValue: Status.ACTIVE,
        },
        shop_details: {
            type: DataTypes.JSON,
            allowNull: true,
        },

        location_details: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        services: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        kyc_details: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        bank_details: {
            type: DataTypes.JSON,
            allowNull: true,
        }

    },
    {
        sequelize,
        tableName: "vendor",
        timestamps: true,
    }
)