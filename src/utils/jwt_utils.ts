import config from "../config/config";
import { TokenPayload } from "../interfaces/jwt.payload";
import jwt from "jsonwebtoken";

export class JwtUtils {
    static generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(
            {
                id: payload.id,
                email: payload.email,
                role: payload.role
            },
            config.app.jwtSecret,
            {
                expiresIn: "1d"
            }
        )
    }


    static verifyAccessToken(token: string): TokenPayload {
        return jwt.verify(token, config.app.jwtSecret) as TokenPayload;
    }



    static generateRefreshToken(payload: TokenPayload): string {
        const refreshToken = jwt.sign(
            {
                id: payload.id
            },
            config.app.jwtRefreshToken,
            {
                expiresIn: '7d'
            }
        );
        return refreshToken;
    };

    static verifyRefreshToken(token: string): TokenPayload {
        return jwt.verify(token, config.app.jwtRefreshToken) as TokenPayload;
    }

}