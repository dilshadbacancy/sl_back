import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger";

interface LogRequest extends Request {
    startTime?: number;
}

export const requestLogger = (
    req: LogRequest,
    res: Response,
    next: NextFunction
) => {
    req.startTime = Date.now();

    logger.http("Incoming Request", {
        method: req.method,
        url: req.url,
        ip: req.ip,
        body: req.body,
        param: req.params,
        userAgent: req.get("user-agent"),
    });

    const originalEnd = res.end;
    res.end = function (chunk?: any, encoding?: any, cb?: any) {
        const duration = Date.now() - (req.startTime || 0);

        // logger.http("Outgoing Response", {
        //     method: req.method,
        //     url: req.url,
        //     statusCode: res.statusCode,
        //     duration: `${duration}ms`,
        //     res:chunk
        // });

        return originalEnd.call(this, chunk, encoding, cb);
    };

    next();
};
