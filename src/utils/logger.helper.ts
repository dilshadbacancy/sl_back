import logger from "../config/logger";

class LoggerHelper {


    static logInfo(message: string, meta?: object) {
        console.log(`\n\n==============Success Response==========================`);

        logger.info(message, meta);
    }

    static logError(message: string, meta?: object) {
        logger.error(message, meta);
    }

    static logWarn(message: string, meta?: object) {
        logger.warn(message, meta);
    }

    static logDebug(message: string, meta?: object) {
        logger.debug(message, meta);
    }

    static logHttp(message: string, meta?: object) {
        logger.http(message, meta);
    }

    static logDatabase(operation: string, query?: string, duration?: number) {
        logger.info("Database Operation", {
            operation,
            query,
            duration: duration ? `${duration}ms` : undefined,
        });
    }

    static logAuth(
        event: string,
        userId?: string,
        success: boolean = true,
        meta?: object
    ) {
        logger.info("Authentication Event", {
            event,
            userId,
            success,
            ...meta,
        });
    }

    static logExternalAPI(
        service: string,
        endpoint: string,
        status: number,
        duration?: number
    ) {
        logger.info("External API Call", {
            service,
            endpoint,
            statusCode: status,
            duration: duration ? `${duration}ms` : undefined,
        });
    }
}

export default LoggerHelper;
