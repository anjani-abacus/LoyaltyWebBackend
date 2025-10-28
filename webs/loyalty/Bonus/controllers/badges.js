import softDelete from "@shared/common/softDelete.js";
import prisma from "@shared/dbConfig/database.js";
import buildPrismaFilters from "@shared/common/buildPrismaFilters.js";

export const createBadge = async (req, res, next) => {
    try {
        const { slab_type, title, eligible_days, eligible_value, badge_type, point_value, start_date, end_date,
            point_incentive_type
        } = req.body;
        const { id, name } = req.user;
        const image = req?.file?.key;
        if (!title || !start_date) {
            return res.status(400).json({ message: "Title and start_date are required" });
        }
        const exisiting = await prisma.influencer_badge.findFirst({
            where: {
                title
            }
        });
        if (exisiting) {
            return res.status(400).json({
                status: false,
                message: "Badge with This Title already exists"
            });
        }
        const badge = await prisma.influencer_badge.create({
            data: {
                slab_type,
                title,
                eligible_days,
                eligible_value: Number(eligible_value),
                badge_type,
                point_incentive_type,
                point_value: Number(point_value),
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                image : image ,
                created_by_id:id,
                created_by_name:name
            }        },
        );
        res.status(201).json({ message: "Badge created successfully", data: badge });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
export const updateBadge = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {status} =req.body;
        const updateStaus = await prisma.influencer_badge.update({
            where: { id: Number(id) },
            data: {
                status,
                last_updated_by: new Date(),
                last_updated_by_id: req.user.id,
                last_updated_by_name: req.user.name
            }
            })
            res.status(200).json(
                {status:true, message:"Updated!"
                    ,data:updateStaus
                }
                )
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

export const getAllBadges = async (req, res, next) => {
    const {  page = 1, limit = 50,filters = {}} = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    
    try {
        const fieldTypes = {
            status: "boolean",
            date_created: "date"
        };

        const where = buildPrismaFilters(filters, fieldTypes);
        const badges = await prisma.influencer_badge.count();
        const totalActive = await prisma.influencer_badge.count({ where: { status: true } });
        const totalInactive = badges - totalActive;
        const badgesData = await prisma.influencer_badge.findMany({
            where,
            skip,
            take,
        });
        res.status(200).json({ Status : true,message: "Badges fetched successfully",count:badges, totalActive,totalInactive,data: badgesData });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const enrollInfluencerBadge = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { influencer_type } = req.body;
        await prisma.influencer_badge.update({
            where: { id: Number(id) },
            data: {
                influencer_type,
                last_changed_On: new Date(),
                last_changed_by_id: req.user.id,
                last_changed_by_name: req.user.name
            }
        })
        res.status(200).json({ message: "Badge enrolled successfully" });
    } catch (error) {
        console.log(error);
    }
}
export const softDeleteinfluencerbadges = async (req, res, next) => {
    try {
        const { id } = req.params;

        await softDelete('influencer_badge', 'id', Number(id));
        res.status(200).json({ message: "Badge deleted successfully" });

    } catch (error) {
        console.log(error);
        next(error);
    }
}