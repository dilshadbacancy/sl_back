import { Response, Request } from "express";
import { ZodError } from "zod";
import { getContext } from "./request.context";
import { formatZodError } from "../errors/app.errors";
import LoggerHelper from "./logger.helper";

// Type definitions
interface PaginatedData<T> {
    rows: T[];
    count: number;
}

interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface SuccessResponse<T = any> {
    success: true;
    message: string;
    data?: T;
    meta?: PaginationMeta;
}

interface ErrorResponse {
    success: false;
    message: string;
    errors?: any;
}

type ApiResponseType<T> = SuccessResponse<T> | ErrorResponse;

export class ApiResponse {
    /**
     * Send a successful API response
     * @param message - Success message
     * @param data - Response data (can be object, array, or paginated result)
     * @param statusCode - HTTP status code (default: 200)
     * @returns void (response is already sent)
     */
    static success<T = any>(
        message: string = "Success",
        data: T | null = null,
        statusCode: number = 200
    ): void {
        const context = getContext();

        if (!context) {
            throw new Error(
                "Request context not found. Make sure ALS middleware is applied before routes."
            );
        }

        const { res, req } = context;

        const response: SuccessResponse<T> = {
            success: true,
            message,
        };

        // Handle paginated data (Sequelize findAndCountAll result)
        if (this.isPaginatedData(data)) {
            const paginatedData = data as PaginatedData<T>;
            const page = this.getPageNumber(req);
            const limit = this.getLimitNumber(req);

            response.data = paginatedData.rows as T;
            response.meta = {
                total: paginatedData.count,
                page,
                limit,
                totalPages: Math.ceil(paginatedData.count / limit),
            };
        }
        // Handle array data
        else if (Array.isArray(data)) {
            const page = this.getPageNumber(req);
            const limit = this.getLimitNumber(req, data.length);

            response.data = data as T;
            response.meta = {
                total: data.length,
                page,
                limit,
                totalPages: 1,
            };
        }
        // Handle single object or null
        else if (data !== null && data !== undefined) {
            response.data = data as T;
        }

        LoggerHelper.logInfo(message, response);

        res.status(statusCode).json(response);
    }

    /**
     * Send an error API response
     * @param error - Error object (ZodError, AppErrors, Error, or string)
     * @param statusCode - HTTP status code (default: 500)
     * @returns void (response is already sent)
     */
    static error(error: unknown, statusCode: number = 500): void {
        const context = getContext();

        if (!context) {
            throw new Error(
                "Request context not found. Make sure ALS middleware is applied before routes."
            );
        }

        const { res } = context;

        const errorResponse = this.formatError(error);
        const response: ErrorResponse = {
            success: false,
            message: errorResponse.message,
            errors: errorResponse.details || undefined,
        };

        LoggerHelper.logError(errorResponse.message, errorResponse.details);

        res.status(errorResponse.statusCode || statusCode).json(response);
    }

    /**
     * Check if data is paginated (Sequelize findAndCountAll format)
     */
    private static isPaginatedData<T>(data: any): data is PaginatedData<T> {
        return (
            data &&
            typeof data === "object" &&
            "rows" in data &&
            "count" in data &&
            Array.isArray(data.rows) &&
            typeof data.count === "number"
        );
    }

    /**
     * Get page number from request query
     */
    private static getPageNumber(req: Request): number {
        const page = Number(req.query.page);
        return isNaN(page) || page < 1 ? 1 : page;
    }

    /**
     * Get limit number from request query
     */
    private static getLimitNumber(req: Request, defaultLimit: number = 10): number {
        const limit = Number(req.query.limit);
        return isNaN(limit) || limit < 1 ? defaultLimit : Math.min(limit, 100); // Max 100 items
    }

    /**
     * Format error into consistent structure
     */
    private static formatError(error: unknown): {
        message: string;
        details: any;
        statusCode?: number;
    } {
        // Handle Zod validation errors
        if (error instanceof ZodError) {
            const errors = formatZodError(error);
            return {
                message: "Validation Failed",
                details: errors[0] || null,
                statusCode: 400,
            };
        }

        // Handle custom AppErrors
        if (error && typeof error === "object" && "errors" in error && Array.isArray(error.errors)) {
            const firstError = (error as any).errors[0];
            return {
                message: firstError?.message || "Validation Failed",
                details: {
                message: firstError?.message,
                type: firstError?.type,
                field: firstError?.path,
                value: firstError?.value,
                },
                statusCode: (error as any).statusCode || 400,
            };
        }

        // Handle Error objects
        if (error instanceof Error) {
            return {
                message: error.message || "Something went wrong",
                details: {
                message: error.message,
                    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
                },
                statusCode: (error as any).statusCode || 500,
            };
        }

        // Handle string errors
        if (typeof error === "string") {
            return {
                message: error,
                details: { message: error },
            };
        }

        // Fallback for unknown error types
        return {
            message: "Something went wrong",
            details: null,
        };
    }
}
