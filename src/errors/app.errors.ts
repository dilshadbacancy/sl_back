// src/errors/CustomError.ts
import { ZodError } from "zod";
import LoggerHelper from "../utils/logger.helper";


export class AppErrors extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public errorCode?: string;
    public errors?: any;

    constructor(
        message: any,
        statusCode: number = 400,
        isOperational: boolean = true,
        errorCode?: string
    ) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errorCode = errorCode;

        // if Zod error -> format clean JSON
        if (message instanceof ZodError) {
            this.errors = formatZodError(message)

            this.message = "Validation failed";
        }

        // LoggerHelper.logError(this.message);
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, AppErrors.prototype);
    }
}


export const formatZodError = (error: ZodError) => {
    return error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
        code: issue.code,
        expected: (issue as any).expected,
        received: (issue as any).received,
    }));
};
export class ValidationError extends AppErrors {
    constructor(message: string = 'Validation Error') {
        super(message, 400, true, 'VALIDATION_ERROR');
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class NotFoundError extends AppErrors {
    constructor(message: string = 'Resource Not Found') {
        super(message, 404, true, 'NOT_FOUND');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class UnauthorizedError extends AppErrors {
    constructor(message: string = 'Unauthorized Access') {
        super(message, 401, true, 'UNAUTHORIZED');
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

export class ForbiddenError extends AppErrors {
    constructor(message: string = 'Forbidden') {
        super(message, 403, true, 'FORBIDDEN');
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

export class ConflictError extends AppErrors {
    constructor(message: string = 'Conflict Error') {
        super(message, 409, true, 'CONFLICT');
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

export class DatabaseError extends AppErrors {
    constructor(message: string = 'Database Error') {
        super(message, 500, true, 'DATABASE_ERROR');
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}

export class BadRequestError extends AppErrors {
    constructor(message: string = 'Bad Request') {
        super(message, 400, true, 'BAD_REQUEST');
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

export class InternalServerError extends AppErrors {
    constructor(message: string = 'Internal Server Error') {
        super(message, 500, false, 'INTERNAL_SERVER_ERROR');
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}