// app.js
import express from "express";
import cors from "cors";
import helmet from 'helmet'
import path from 'path';
import errorHandler from "@shared/common/errorHandler.js";
import rateLimit from "express-rate-limit";
import { authenticateToken } from "@shared/middlewares/authenticateToken.js";
import loyaltyRoutes from "./routes/index.js";
import compression from "compression";
import cookieParser from 'cookie-parser';
import fs from 'fs';
import swaggerUi from "swagger-ui-express";
const swaggerPath = path.resolve('./swagger-output.json');
const swaggerFile = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
const app = express();

app.use(cookieParser());

const __dirname = path.resolve();

app.use(compression({
    filter: (req, res) => {
        return req.headers['accept']?.includes('application/json');
    }
}));
const allowedOrigins = ['http://localhost:5173', 'https://web-loyalty.basiq360.com'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`Blocked by CORS: ${origin}`);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.options(/.*/, cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(helmet());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests, try again later.',
    })
);

app.use((req, res, next) => {
    const contentType = req.headers['content-type'] || '';

    const isJson = contentType.includes('application/json');
    const isUrlEncoded = contentType.includes('application/x-www-form-urlencoded');
    const isMultipart = contentType.includes('multipart/form-data');

    if (
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) &&
        (isJson || isUrlEncoded) 
    ) {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Request body is empty' });
        }
    }

       next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/loyalty',loyaltyRoutes);

app.use(errorHandler);

export default app;
