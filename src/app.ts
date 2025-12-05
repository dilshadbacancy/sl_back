import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/common/auth.route"
import { requestContext } from "./utils/request.context";
import { morganFormats } from "./config/morgan.stream";
import { requestLogger } from "./middlewares/logger/request.logger";
import logger from "./config/logger";
import { errorLogger } from "./middlewares/logger/error.logger";

import adminRoute from "./routes/admin/admin.route"
import { AppErrors } from "./errors/app.errors";
import userRoute from "./routes/user/user.route";
import commonRoute from "./routes/common/common.route";
import saloonRoute from "./routes/user/saloon.route";
import shopRoute from "./routes/vendor/shop.route";
import barberRoute from "./routes/vendor/barbar.route"

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use(
    process.env.NODE_ENV === "development"
        ? morganFormats.dev
        : morganFormats.custom
);

app.use(requestLogger);



// ⭐ 1. CONTEXT MIDDLEWARE (MUST BE FIRST)
app.use((req, res, next) => {
    requestContext.run({ req, res }, () => {
        next();
    });
});


/// Routes Here.....

app.use("/auth", authRouter)

app.use("/users", userRoute);
app.use("/common", commonRoute);
app.use("/vendor", shopRoute)
app.use("/saloon", saloonRoute)
app.use("/admin", adminRoute)
app.use("/barber", barberRoute)



app.get("/api", (req, res) => {
    res.json({ message: "Server Running" });
});

app.use(errorLogger);

// 404
app.use((req, res) => {
    logger.warn("Route not found", { url: req.url, method: req.method });
    res.status(404).json({ message: "Route not found" });
});


app.use((err: any, res, next) => {
    // If it's our custom AppErrors
    if (err instanceof AppErrors) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,       // ✔ CLEAN MESSAGE
            errors: err.errors || null, // ✔ FOR ZOD ERRORS
        });
    }

    // For any unexpected errors
    return res.status(500).json({
        success: false,
        message: err.message || "Something went wrong",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});



// Global exception handlers
process.on("unhandledRejection", (reason: any) => {
    logger.error("Unhandled Promise Rejection", reason);
});

process.on("uncaughtException", (err: Error) => {
    logger.error("Uncaught Exception", err);
    process.exit(1);
})





export default app;
