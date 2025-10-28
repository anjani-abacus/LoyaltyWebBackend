import prisma from "@shared/dbConfig/database.js";
import softDelete from "@shared/common/softDelete.js";
import { config } from "@shared/utils/env.js";

export const createBanner = async (req, res,next) => {
    try {
        const {  banner_name, user_type } = req.body;
        const banner_image = `${config.s3.publicUrl}/${req.file?.key}`;

        const newBanner = await prisma.banner_master.create({
            data: {
                date_created: new Date(),
                created_by_id:req.user.id,
                created_by_name:req.user.name,
                banner_name,
                user_type,
                ...(banner_image && { banner_image })
            },
        });

        res.status(201).json({ success: true, data: newBanner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        next(error)
    }
};

export const getAllBanners = async (req, res,next) => {
    try {
        const banners = await prisma.banner_master.findMany({
            where:{
                del:false
            }
        });
        res.status(200).json({ success: true, data: banners });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        next(error)
    }
};

export const getBannerById = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await prisma.banner_master.findUnique({
            where: { id: parseInt(id),del:false },
        });

        if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

        res.status(200).json({ success: true, data: banner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateBanner = async (req, res,next) => {
    try {
        const { id } = req.params;
        const { banner_name, user_type } = req.body;
        const banner_image = req.file?.key
            ? `${config.s3.publicUrl}/${req.file.key}`
            : undefined;
        const updatedBanner = await prisma.banner_master.update({
            where: { id: parseInt(id) },
            data: {
                banner_name, user_type,
                ...(banner_image ? { banner_image } : {}), 

 },
        });

        res.status(200).json({ success: true, data: updatedBanner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        next(error)
    }
};

export const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;

        await softDelete('banner_master', 'id', parseInt(id));

        res.status(200).json({ success: true, message: 'Banner deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
