import express from 'express';
import upload from '@shared/middlewares/multerS3.js';
import { uploadPostalCSV }from '../controllers/uploadpostalController.js'
import { downloadTemplate, uploadInfluencerCSV } from '../controllers/uploadInfluencerController.js';
import { uploadCSVLocal } from '@shared/middlewares/multerDS.js';
import { authenticateToken } from '@shared/middlewares/authenticateToken.js';
import { downloadProductTemplate, uploadProductCSV } from '../controllers/uploadproductController.js';
import { setUserContext } from "@shared/dbConfig/database.js";

const uploadRouter = express.Router();

uploadRouter.post('/upload_postal_csv', upload.single('file'), uploadPostalCSV);

// upload influencer routes
uploadRouter.get("/download-template", downloadTemplate);
uploadRouter.post('/upload_influencer_csv',authenticateToken,setUserContext, uploadCSVLocal.single('file'),uploadInfluencerCSV);

// upload product routes
uploadRouter.get("/download-product-template", downloadProductTemplate);
uploadRouter.post('/upload_product_csv', authenticateToken, uploadCSVLocal.single('file'), uploadProductCSV);

export default uploadRouter;
