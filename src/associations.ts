import Service from "./models/vendor/service.model";
import { OTP } from "./models/auth/otp.model";
import { DeviceInfo } from "./models/user/device_info.model";
import { FCM } from "./models/user/fcm.model";
import { User } from "./models/user/user.model";
import { Barber } from "./models/vendor/barber.model";
import { Shop } from "./models/vendor/shop.model";
import ShopBankDetails from "./models/vendor/shop_bank_details";
import { ShopKycDetail } from "./models/vendor/shop_kyc.model";
import { ShopLocation } from "./models/vendor/shop_location";
import { Appointment } from "./models/user/appointment";
import { AppointmentService } from "./models/vendor/appointment_service.model";



// User → OTP
User.hasMany(OTP, {
    foreignKey: "user_id",
    as: "user_otps",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

OTP.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});


// User → DeviceInfo
User.hasMany(FCM, {
    foreignKey: "user_id",
    as: "user_fcms",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

FCM.belongsTo(User, {
    foreignKey: "user_id",
    as: "fcm_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});


// DeviceInfo → FCM
DeviceInfo.hasMany(FCM, {
    foreignKey: "device_id",
    as: "device_fcm_tokens",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

FCM.belongsTo(DeviceInfo, {
    foreignKey: "device_id",
    as: "fcm_device_info",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});


// Shop -> User

User.hasMany(Shop, {
    foreignKey: "user_id",
    as: "shops",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

User.hasMany(Appointment, {
    foreignKey: "customer_id",
    as: "appointments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})


Shop.belongsTo(User, {
    foreignKey: "user_id",
    as: "shop_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

Shop.belongsTo(User, {
    foreignKey: "user_id",
    as: "shop_owner",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})


// Shop -> Location

Shop.hasOne(ShopLocation, {
    foreignKey: "shop_id",
    as: "shop_location",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

ShopLocation.belongsTo(Shop, {
    foreignKey: "shop_id",
    as: "shop",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});


// Shop -> KYC
// A ShopKycDetail belongs to a Shop
ShopKycDetail.belongsTo(Shop, {
    foreignKey: "shop_id",
    as: "shop",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

// A Shop has one KYC detail
Shop.hasOne(ShopKycDetail, {
    foreignKey: "shop_id",
    as: "shop_kyc_details",
    onDelete: "CASCADE"
});


/// Shop -> Bank

ShopBankDetails.belongsTo(Shop, {
    foreignKey: "shop_id",
    as: "shop",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

Shop.hasOne(ShopBankDetails, {
    foreignKey: "shop_id",
    as: "shop_bank_details",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

// Shop -> Barber

Barber.belongsTo(Shop, {
    foreignKey: "shop_id",
    as: "barber",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

Shop.hasMany(Barber, {
    foreignKey: "shop_id",
    as: "shop_barbers",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})


// Shop ->Service

// Shop -> Service
Shop.hasMany(Service, {
    foreignKey: "shop_id",
    as: "shop_services",// must match your include
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Service.belongsTo(Shop, {
    foreignKey: "shop_id",
    as: "shop",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

// Appointment.ts associations

// Associations
Appointment.belongsTo(User, {
    foreignKey: "customer_id",
    as: "customer",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
Appointment.belongsTo(Shop, {
    foreignKey: "shop_id",
    as: "shop",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Shop.hasMany(Appointment, {
    foreignKey: "shop_id",
    as: "appointments",
    onDelete: "CASECADE",
    onUpdate: "CASECADE",
})
Appointment.belongsTo(Barber, {
    foreignKey: "barber_id",
    as: "barber",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
Appointment.hasMany(AppointmentService, {
    foreignKey: "appointment_id", as: "services",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

AppointmentService.belongsTo(Appointment, {
    foreignKey: "appointment_id", as: "appointment",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

AppointmentService.belongsTo(Service, {
    foreignKey: "service_id", as: "service",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});