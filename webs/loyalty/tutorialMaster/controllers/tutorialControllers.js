import prisma from "@shared/dbConfig/database.js";
import softDelete from "@shared/common/softDelete.js";

export const createVideo = async (req, res, next) => {
    try {
        const { user_type, video_title, video_url, video_desc, platform, sequence } = req.body;

        const newVideo = await prisma.tutorial_video_master.create({
            data: {
                created_by_id:req.user.id,
                created_by_name:req.user.name,
                user_type,
                video_title,
                video_url,
                video_desc,
                platform,
                sequence
            },
        });

        res.status(201).json({ success: true, data: newVideo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        next(error);
    }
};

export const getAllVideos = async (req, res, next) => {
    try {
        const videos = await prisma.tutorial_video_master.findMany({
            where: { del: false }
        });
        res.status(200).json({ success: true, data: videos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        next(error);
    }
};

export const getVideoById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const video = await prisma.tutorial_video_master.findUnique({
            where: { id: parseInt(id) , del: false},
        });

        if (!video || video.del) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        res.status(200).json({ success: true, data: video });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        next(error);
    }
};
export const updateVideo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { user_type, video_title, video_url, video_desc, platform, sequence } = req.body;

        const updatedVideo = await prisma.tutorial_video_master.update({
            where: { id: parseInt(id) },
            data: {
                ...(user_type ? { user_type } : {}),
                ...(video_title ? { video_title } : {}),
                ...(video_url ? { video_url } : {}),
                ...(video_desc ? { video_desc } : {}),
                ...(platform ? { platform } : {}),
                ...(sequence ? { sequence } : {}),
            },
        });

        res.status(200).json({ success: true, data: updatedVideo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        next(error);
    }
};
export const deleteVideo = async (req, res, next) => {
    try {
        const { id } = req.params;

     await softDelete('tutorial_video_master', 'id', parseInt(id));

        res.status(200).json({ success: true, message: "Video deleted successfully"});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        next(error);
    }
};
