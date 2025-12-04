import { AppErrors } from "../errors/app.errors";
import { DeviceInfo } from "../models/user/device_info.model";
import { FCM } from "../models/user/fcm.model";
import { User } from "../models/user/user.model";


export class CommonService {


    static async saveDeviceInfo(data: any, user_id: string): Promise<DeviceInfo> {
        try {

            let device = await DeviceInfo.findOne({ where: { user_id } })

            if (!device) {
                device = await DeviceInfo.create(data)
            } else {
                await device.update({ ...data })
            }
            return device;

        } catch (error) {
            throw new AppErrors(error);
        }

    }

    static async getDeviceInfo(userId: string): Promise<DeviceInfo> {
        try {
            const device = await DeviceInfo.findOne({
                where: { user_id: userId }, include: [
                    {
                        model: User, as: "device_user_info",
                        attributes: ["id", "first_name", "last_name", "mobile", "email", "status", "location",],
                    }
                ],
                attributes: ["id", "role", "device_info", "platform_info"]
            })
            if (!device) {
                throw new AppErrors("Device not found")
            }
            return device
        } catch (error) {
            throw new AppErrors(error)
        }


    }



    static async saveFcmToken(data: any): Promise<any> {
        try {
            const fcm = await FCM.create(data);
            return fcm;
        } catch (e) {
            throw new AppErrors(e);
        }
    }

    static async getFCMToken(user_id: string): Promise<FCM[]> {
        try {
            const token = await FCM.findAll({
                where: { user_id },
                include: [
                    { model: User, as: "fcm_user" },
                    { model: DeviceInfo, as: "fcm_device_info" }
                ]
            })
            if (!token) {
                throw new AppErrors("No FCM tokens associated with the current user.")
            }
            return token;
        } catch (error) {
            throw new AppErrors(error)
        }
    }
}   