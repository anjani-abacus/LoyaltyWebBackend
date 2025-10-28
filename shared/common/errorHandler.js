
import { Prisma } from '@prisma/client';
import multer from 'multer'; 
import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    logger.error(err); 

    // Prisma Known Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                return res.status(409).json({
                    error: 'Duplicate field value entered or already exists',
                    meta: err.meta,
                });
            case 'P2003':
                return res.status(400).json({
                    error: 'Foreign key constraint failed',
                    meta: err.meta,
                });
            case 'P2025':
                return res.status(404).json({
                    error: 'Record not found or update failed because the item does not exist',
                    model: err.meta?.modelName,
                    cause: err.meta?.cause || 'No record found for the operation.',
                });
            default:
                return res.status(500).json({
                    error: 'Prisma Client Known Request Error',
                    code: err.code,
                    meta: err.meta,
                });
        }
    }


    // Prisma Unknown Error
    if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        return res.status(500).json({
            error: 'Unknown Prisma error',
            message: err.message,
        });
    }

    // Prisma Rust Panic
    if (err instanceof Prisma.PrismaClientRustPanicError) {
        return res.status(500).json({
            error: 'Prisma internal panic occurred',
            message: err.message,
        });
    }

    // Prisma Initialization
    if (err instanceof Prisma.PrismaClientInitializationError) {
        return res.status(500).json({
            error: 'Prisma initialization failed',
            message: err.message,
        });
    }

    // Prisma Validation
    if (err instanceof Prisma.PrismaClientValidationError) {
        return res.status(422).json({
            error: 'Validation failed',
            message: err.message,
        });
    }

    // Express Validator
    if (typeof err.array === 'function') {
        return res.status(400).json({ errors: err.array() });
    }

    // JWT Errors
    if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Multer File Upload Errors
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File size too large' });
    }

    // Fallback: Unhandled errors
    return res.status(500).json({
        error: 'Internal Server Error',
        message: err.message || 'Something went wrong!',
    });
};

export default errorHandler;
