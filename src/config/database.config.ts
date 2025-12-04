// src/config/database.ts
import { Sequelize } from "sequelize";
import config from "./config";

export class SequelizeConnection {
    private static instance: Sequelize;

    private constructor() { }

    public static getInstance(): Sequelize {
        if (!SequelizeConnection.instance) {
            SequelizeConnection.instance = new Sequelize(
                config.database.name,
                config.database.user,
                config.database.password,
                {
                    host: config.database.host,
                    dialect: "mysql",
                    logging: console.log,
                    pool: {
                        max: 5,
                        min: 0,
                        acquire: 30000,
                        idle: 10000,
                    },
                }
            );
            console.log("Database connection initialized!");
        }

        return SequelizeConnection.instance;
    }
}
