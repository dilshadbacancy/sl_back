import { OTP } from "./models/auth/otp.model";
import { DeviceInfo } from "./models/user/device_info.model";
import { FCM } from "./models/user/fcm.model";
import { User } from "./models/user/user.model";



OTP.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
DeviceInfo.belongsTo(User, { foreignKey: "user_id", as: "device_user_info", onDelete: "CASCADE", onUpdate: "CASCADE" })
FCM.belongsTo(User, { foreignKey: "user_id", as: "fcm_user", onDelete: "CASCADE", onUpdate: "CASCADE" });
FCM.belongsTo(DeviceInfo, { foreignKey: "device_id", as: "fcm_device_info", onDelete: "CASCADE", onUpdate: "CASCADE" })

