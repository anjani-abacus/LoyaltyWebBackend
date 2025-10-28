import express from 'express';
import { createGiftGallery, getGiftGallery, softDeleteGiftGallery,  updateGiftGalleryStatus } from '../controllers/giftGalleryController.js';
import upload from '@shared/middlewares/multerS3.js';
import { giftGallerySchema} from '../joiValidators/giftgalleryValidator.js';
import { validateBody } from '@shared/common/validateBody.js';
import { validateParam } from '@shared/common/validateParam.js';
import { idParamSchema } from '@shared/common/idParamSchema.js';
import { authenticateToken } from '@shared/middlewares/authenticateToken.js';
import { setUserContext } from "@shared/dbConfig/database.js";

const giftGalleryRoutes=express.Router();

giftGalleryRoutes.post('/create_gift_gallery',authenticateToken,setUserContext,upload.single('gift_img'), validateBody(giftGallerySchema),createGiftGallery);
giftGalleryRoutes.post('/get_gift_gallery',  getGiftGallery);
giftGalleryRoutes.delete('/soft_delete_gift_gallery/:id', authenticateToken,validateParam(idParamSchema,'id'),  softDeleteGiftGallery);
giftGalleryRoutes.put('/update_status/:id', authenticateToken, updateGiftGalleryStatus)
export default giftGalleryRoutes;