import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { AppErrors } from "../errors/app.errors";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "document/pdf",
];

const fileFilter: multer.Options["fileFilter"] = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // Reject unsupported file types
        return cb(new AppErrors("Unsupported file type"));
    }
};

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter,
});

