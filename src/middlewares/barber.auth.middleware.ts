import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { HelperUtils } from "../utils/helper";
import { TokenPayload } from "../interfaces/jwt.payload";
import { User } from "../models/user/user.model";
import { JwtUtils } from "../utils/jwt_utils";
import { Barber } from "../models/vendor/barber.model";


export interface BarberAuthReq extends Request {
    barber?: Barber
}



const barberBlackListTokens = new Set<string>;
export const barberBlackListToken = (token: string) => {
    barberBlackListTokens.add(token)
}

export const barberAuthMiddleware = async (
    req: BarberAuthReq,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: "Your are not authorises to access the apis, please authorised and try again."
            })
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Invalid token formate  "
            })
            return;
        }

        if (barberBlackListTokens.has(token)) {
            res.status(401).json({
                status: false,
                messgae: "Token is blacklisted, Please login again"
            })
            return;
        }

        const decoded = JwtUtils.verifyAccessToken(token) as TokenPayload;

        const barber = await HelperUtils.findBarberById(decoded.id);

        if (!barber) {
            res.status(401).json({
                success: false,
                message: "Current user no longer exists."
            })
            return;

        }
        if (barber.role !== "barber") {
            res.status(401).json({
                success: false,
                message: "Current user role is not allowed"
            })
            return;
        }

        req.barber = barber;
        next();
    } catch (error: any) {
        if (error.name == "JsonWebTokenError") {
            res.status(401).json({
                success: false,
                message: 'Invalid token.',
            });
            return;
        }
        if (error.name === 'TokenExpiredError') {

            res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.',
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Authentication failed.',
            error: error.message,
        });
    }
}