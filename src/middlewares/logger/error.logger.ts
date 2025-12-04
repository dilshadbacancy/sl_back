import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger";
import { AppErrors } from "../../errors/app.errors";

export const errorLogger = (
    err: AppErrors,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = err.statusCode || 500;

    logger.error("Error Occurred", {
        message: err.message,
        statusCode: status,
        url: req.url,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
        stack: err.stack,
    });

    res.status(status).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
