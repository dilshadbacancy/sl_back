import Service from "./models/admin/service.model";
import { OTP } from "./models/auth/otp.model";
import { DeviceInfo } from "./models/user/device_info.model";
import { FCM } from "./models/user/fcm.model";
import { User } from "./models/user/user.model";
import { Barber } from "./models/vendor/barber.mode";
import { Shop } from "./models/vendor/shop.model";
import ShopBankDetails from "./models/vendor/shop_bank_details";
import { ShopKycDetail } from "./models/vendor/shop_kyc.model";
import { ShopLocation } from "./models/vendor/shop_location";



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


Shop.belongsTo(User, {
    foreignKey: "user_id",
    as: "shop_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})


// Shop -> Location

Shop.hasOne(ShopLocation, {
    foreignKey: "shop_id",
    as: "location",
    onDelete: "CASCADE"
});

ShopLocation.belongsTo(Shop, {
    foreignKey: "shop_id",
    as: "shop"
});


// Shop -> KYC
// A ShopKycDetail belongs to a Shop
ShopKycDetail.belongsTo(Shop, {
    foreignKey: "shop_id",
    as: "shop"
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
    as: "shop"
})

Shop.hasOne(ShopBankDetails, {
    foreignKey: "shop_id",
    as: "shop_bank_details"
})

// Shop -> Barber

Barber.belongsTo(Shop, {
    foreignKey: "shop_id",
    as: "barber"
})

Shop.hasMany(Barber, {
    foreignKey: "shop_id",
    as: "shop_barbers"
})


// Shop ->Service

// Shop.belongsToMany(Service, {
//     through: Service,
//     foreignKey: "shop_id",
//     otherKey: "service_id",
//     as: "service"
// });

// Service.belongsToMany(Shop, {
//     through: Service,
//     foreignKey: "service_id",
//     otherKey: "shop_id",
//     as: "shops"
// });



