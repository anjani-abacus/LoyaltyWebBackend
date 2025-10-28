import express from 'express';
import { authenticateToken } from '@shared/middlewares/authenticateToken.js';
import { createBanner, deleteBanner, getAllBanners, getBannerById, updateBanner } from '../controllers/bannerControllers.js';
import upload from '@shared/middlewares/multerS3.js';
import { setUserContext } from "@shared/dbConfig/database.js";

const bannerRoutes = express.Router();

bannerRoutes.post('/create_banner',authenticateToken,setUserContext,upload.single('banner_image'), createBanner);
bannerRoutes.get('/get_all_banners', getAllBanners);
bannerRoutes.get('/get_banner_by_id/:id', getBannerById);
bannerRoutes.put('/update_banner/:id', upload.single('banner_image'), updateBanner);
bannerRoutes.delete('/delete_banner/:id', deleteBanner);

export default bannerRoutes;