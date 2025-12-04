"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/config.ts
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const env = process.env.NODE_ENV || "development";
dotenv_1.default.config({
    path: path_1.default.resolve(process.cwd(), `.env${env === "production" ? ".production" : ""}`)
});
const config = {
    database: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        name: process.env.DB_NAME || "hyperlocal_shop"
    },
    app: {
        port: parseInt(process.env.PORT || "5000", 10),
        jwtSecret: process.env.JWT_SECRET || "default_secret"
    }
};
exports.default = config;
//# sourceMappingURL=config.js.map