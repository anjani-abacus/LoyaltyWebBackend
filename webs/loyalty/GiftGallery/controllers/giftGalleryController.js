import softDelete from "@shared/common/softDelete.js";
import prisma from "@shared/dbConfig/database.js";
import { config } from "@shared/utils/env.js";
import buildPrismaFilters from "@shared/common/buildPrismaFilters.js";

export const createGiftGallery = async (req, res, next) => {
    const { gift_type, 
        influencer_type,
         title,
          gift_point,
           termsNcondition, 
            point_range_value
         } = req.body;
    const { id, name } = req.user;
    try {
        if (!req?.file?.key)
            return res.status(400).json({ message: 'Image is required' });
        const existing = await prisma.gift_gallery_master.findFirst({
            where: {
                title
            }
            });
        if (existing)
            return res.status(400).json({ message: 'Gift Gallery With This Title already exists' });

        const gift_img = `${config.s3.publicUrl}/${req?.file?.key}`;
        const giftGallery = await prisma.gift_gallery_master.create({
            data: {
                gift_type: gift_type.toUpperCase(),
                influencer_type,
                title,
                gift_point,
                gift_img,
                termsNcondition,
                point_range_value,
                created_by_id:id,
                created_by_name:name
            }        },
        )
        res.status(200).json({ message: 'Gift Gallery inserted successfully', data: giftGallery });
    } catch (error) {
        next(error);
    }
}

export const getGiftGallery = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, filters = {} } = req.body;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const fieldTypes = {
            gift_type: 'enum',
            date_created: 'date',
            title: 'string'
        };

        const where = buildPrismaFilters(filters, fieldTypes);
        const totalGift = await prisma.gift_gallery_master.count({ where: { gift_type: 'GIFT' } });
        const totalCash = await prisma.gift_gallery_master.count({ where: { gift_type: 'CASH' } });
        const giftGallery = totalGift + totalCash;
        const giftGalleryBySearch = await prisma.gift_gallery_master.findMany({
            where,
            skip,
            take,
            orderBy: {
                date_created: 'desc'
            }
        });
        
        res.status(200).json({ message: 'Gift Gallery fetched successfully',count:giftGallery,totalGift,totalCash, data: giftGalleryBySearch });
    } catch (error) {
        next(error);
    }
}

export const softDeleteGiftGallery = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: userId, name } = req.user;
        await softDelete('gift_gallery_master', 'id', Number(id));
        await prisma.gift_gallery_master.update({
            where: { id: parseInt(id) },
            data: { status: false, 
                del:true,    
               last_status_changed_on:new Date(Date.now()),
                 status_changed_by:userId,
                  status_changed_by_name :name}
        });
        res.status(200).json({ message: 'Gift Gallery deleted successfully' });
    } catch (error) {
        next(error);
    }
}

export const updateGiftGalleryStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status} = req.body;

        await prisma.gift_gallery_master.update({
            where: { id: parseInt(id) },
            data: { status :status,
                last_status_changed_on:new Date(Date.now()),
                 status_changed_by:req.user.id,
                  status_changed_by_name :req.user.name}    
        });
        res.status(200).json({ message: 'Gift Gallery updated successfully' });
    } catch (error) {
        next(error);
    }
}


