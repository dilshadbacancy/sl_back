import { AppErrors } from "../../errors/app.errors";
import { Barber } from "../../models/vendor/barber.mode";
import { Roles, Status } from "../../utils/enum.utils";
import { HelperUtils } from "../../utils/helper";
import { JwtUtils } from "../../utils/jwt_utils";
import { RefreshToken } from "../../models/auth/RefreshToken.model";
import { da } from "zod/v4/locales";

export class BarberService {
    static async createBarber(data: any): Promise<Barber> {
        const { mobile, name, email } = data;
        let barber = await Barber.findOne({ where: { mobile, name, email } })
        console.log(data.shop_id, data.shop_id.length);

        if (barber) {
            throw new AppErrors("Already exist with the same details")
        }
        const username = HelperUtils.generateUsername(name);
        const login_pin = HelperUtils.generateOTP();
        barber = await Barber.create({
            user_id: data.user_id,
            shop_id: data.shop_id,
            name: name,
            email: email,
            mobile: mobile,
            role: Roles.BARBER,
            age: data.age || undefined,
            gender: data.gender,
            specialist_in: data.specialist_in || undefined,
            status: Status.ACTIVE,
            available: true,
            username: username,
            login_pin: login_pin
        });
        return barber;
    }

    static async updateBarber(data: any): Promise<Barber> {
        const id = data.id;
        const barber = await Barber.findByPk(id);
        if (!barber) {
            throw new AppErrors("No barber found")
        }
        let isAvailable = barber.available;

        if (data.status) {
            const incomingStatus = data.status;
            if (incomingStatus && !Object.values(Status).includes(incomingStatus as Status)) {
                throw new AppErrors("Invalid status value");
            }

            isAvailable = incomingStatus === Status.ACTIVE;
        }


        await barber.update({ ...data, available: isAvailable })
        return barber;
    }

    static async getAllBarbers(id: string, available: boolean | undefined): Promise<Barber[]> {

        let whereCaluse: any = { shop_id: id }

        if (available !== undefined) {
            whereCaluse.available = available;
        }

        const barbers = await Barber.findAll({ where: whereCaluse });
        return barbers;
    }


    static async toggleAvailability(available: boolean, id: string): Promise<any> {
        const barber = await Barber.findByPk(id);

        if (!barber) {
            throw new AppErrors("No barber found")
        }

        await barber.update({ available: available })
        const presence = available ? "on" : "off"
        return {
            message: `${barber.name} is ${presence} work today`
        }
    }

    static async loginBarber(username: string, login_pin: number): Promise<any> {

        const barber = await Barber.findOne({ where: { username: username, login_pin: login_pin } })

        if (!barber) {
            throw new AppErrors("Barbar does not exist witht the credential")
        }

        const access_token = JwtUtils.generateAccessToken(barber);
        const refreshToken = JwtUtils.generateRefreshToken(barber);

        let refresh = await RefreshToken.findOne({ where: { user_id: barber.user_id } })
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        if (!refresh) {
            refresh = await RefreshToken.create({
                user_id: barber.user_id,
                token: refreshToken,
                expire_at: expiresAt,
                role: barber.role,
                is_revoked: false
            })
        }
        await refresh.update({ token: refreshToken, user_id: barber.user_id, is_revoked: false })
        return {
            user: barber.toJSON(),
            access_token: access_token,
            refresh_token: refreshToken,
        }
    }

    static async getBarbersProfile(id: string): Promise<any> {
        const barber = await Barber.findByPk(id);
        return barber;

    }

    static async punhIn(data: any): Promise<any> {



    }
}