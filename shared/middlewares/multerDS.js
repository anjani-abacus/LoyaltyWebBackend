import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload folder exists
const uploadPath = "uploads";
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const csvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

export const uploadCSVLocal = multer({
    storage: csvStorage,
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname).toLowerCase() !== ".csv") {
            return cb(new Error("Only CSV files are allowed"));
        }
        cb(null, true);
    },
});
