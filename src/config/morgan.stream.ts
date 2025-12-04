import morgan from "morgan";
import { Request, Response } from "express";
import logger from "./logger";

morgan.token("response-time-ms", (req: Request, res: Response) => {
    const rt = res.getHeader("X-Response-Time");
    return rt ? `${rt}ms` : "0ms";
});

const stream = {
    write: (message: string) => logger.http(message.trim()),
};

const morganFormats = {
    dev: morgan("dev", { stream }),
    combined: morgan("combined", { stream }),
    custom: morgan(
        ':method :url :status :response-time ms - :res[content-length] ":user-agent"',
        { stream }
    ),
    skip: morgan("combined", {
        stream,
        skip: (req: Request, res: Response) => res.statusCode < 400,
    }),
};

export { stream, morganFormats };
