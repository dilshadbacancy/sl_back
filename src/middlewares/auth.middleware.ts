import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { HelperUtils } from "../utils/helper";
import { TokenPayload } from "../interfaces/jwt.payload";
import { User } from "../models/user.model";
import { JwtUtils } from "../utils/jwt_utils";


export interface AuthRequest extends Request {
    user?: User
}



const blackListTokens = new Set<string>;
export const blackListToken = (token: string) => {
    blackListTokens.add(token)
}

export const authMiddleware = async (
    req: AuthRequest,
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

        if (blackListTokens.has(token)) {
            res.status(401).json({
                status: false,
                messgae: "Token is blacklisted, Please login again"
            })
            return;
        }

        const decoded = JwtUtils.verifyAccessToken(token) as TokenPayload;

        const user = await HelperUtils.findUserById(decoded.id);

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Current user no longer exists."
            })
            return;

        }

        req.user = user;
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