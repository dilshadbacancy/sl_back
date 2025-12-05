import { ZodError } from "zod";
import { PaginationUtils } from "./pagination.utils";
import { getContext } from "./request.context";
import { formatZodError } from "../errors/app.errors";
import LoggerHelper from "./logger.helper";

export class ApiResponse {

    static success(
        message: string = "Success",
        data: any = null,
        statusCode: number = 200
    ) {
        const context = getContext();

        if (!context) {
            throw new Error("Request context not found. Make sure ALS middleware is applied before routes.");
        }

        const { res, req } = context;

        let responseData = data;
        let meta: any = undefined;

        const isPaginated =
            data &&
            typeof data === "object" &&
            "rows" in data &&
            "count" in data;

        // ⭐ Case 1 — Paginated (findAndCountAll)
        if (isPaginated) {
            responseData = data.rows;

            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? 10);

            meta = {
                total: data.count,
                page,
                limit,
                totalPages: Math.ceil(data.count / limit),
            };
        }

        // ⭐ Case 2 — Array response
        else if (Array.isArray(data)) {
            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? data.length);

            meta = {
                total: data.length,
                page,
                limit,
                totalPages: 1,
            };
        }

        // ⭐ Case 3 — Single object → NO META
        else {
            meta = undefined;
        }

        // ⭐ Build response object dynamically
        const response: any = {
            success: true,
            message,
        };

        // ➤ Add data ONLY if not null
        if (data !== null && data !== undefined) {
            response.data = responseData;
        }

        // ➤ Add meta ONLY if exists
        if (meta) {
            response.meta = meta;
        }

        LoggerHelper.logInfo(message, response)

        return res.status(statusCode).json(response);
    }

    static error(error: any, statusCode: number = 500) {
        const { res } = getContext()!;

        let message = "Something went wrong";
        let details: any = null;

        if (error instanceof ZodError) {
            message = "Validation Failed";
            const errors = formatZodError(error);
            details = errors[0];
        }

        else if (error?.errors && Array.isArray(error.errors)) {
            const firstError = error.errors[0];
            message = firstError?.message || message;
            details = {
                message: firstError?.message,
                type: firstError?.type,
                field: firstError?.path,
                value: firstError?.value,
            };
        } else if (error?.message) {
            message = error.message;
            details = {
                message: error.message,
                stack: error.stack || undefined,
            };
        } else if (typeof error === "string") {
            message = error;
            details = { message: error };
        }

        return res.status(statusCode).json({
            success: false,
            message,
            errors: details,
        });
    }
}
