// src/config/config.ts
import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || "development";

dotenv.config({
    path: path.resolve(process.cwd(), `.env${env === "production" ? ".production" : ""}`)
});

export interface DBConfig {
    host: string;
    user: string;
    password: string;
    name: string;
}

export interface AppConfig {
    port: number;
    jwtSecret: string;
    jwtRefreshToken: string;
    environment: string;
    log_level: string;
}

export interface Config {
    database: DBConfig;
    app: AppConfig;
}

const config: Config = {
    database: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        name: process.env.DB_NAME || "trimly"
    },
    app: {
        port: parseInt(process.env.PORT || "5000", 10),
        jwtSecret: process.env.JWT_SECRET || "default_secret",
        jwtRefreshToken: process.env.JWT_REFRESH_TOKEN || "asklfhsakhdf",
        environment: process.env.NODE_ENV || "development",
        log_level: process.env.LOG_LEVEL || "debug"
    }
};

export default config;
