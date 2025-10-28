import softDelete from "@shared/common/softDelete.js";
import prisma from "@shared/dbConfig/database.js";
import buildPrismaFilters from "@shared/common/buildPrismaFilters.js";
export const createSpinWin = async (req, res, next) => {
    const { point_section, eligible_days, slab_point } = req.body;
    const { id, name } = req.user;

    try {
        if (
            typeof point_section !== "number" ||
            !Array.isArray(slab_point) ||
            slab_point.length !== point_section
        ) {
            return res.status(400).json({
                status: false,
                message:
                    "slab_point must be an array with length equal to point_section (number)",
            });
        }

        // 1️⃣ Create parent record first
        const record = await prisma.spin_win_user_record.create({
            data: {
                point_section,
                eligible_days,
                created_by_id: id,
                created_by_name: name,
            }        },
      );

        // 2️⃣ Create child records with correct FK (record.id)
        const slab_point_record = await Promise.all(
            slab_point.map((point) =>
                prisma.assigned_spin.create({
                    data: {
                        spin_id: record.id, // ✅ FIX: use parent record.id
                        slab_point: point,
                    }                },
                            )            )
        );

        res.status(200).json({
            status: true,
            message: "Spin win created successfully",
            data: record,
            slab_point: slab_point_record,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getSpinWin = async (req, res, next) => {
    const { page = 1, limit = 20 ,filters={}} = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    try {
        const fieldTypes = {
            status: "boolean",
            date_created: "date"
        };

        const where = buildPrismaFilters(filters, fieldTypes);
        const spinWinCount = await prisma.spin_win_user_record.count();
        const totalActive = await prisma.spin_win_user_record.count({ where: { status: true } });
        const totalInactive = spinWinCount - totalActive;
        const spinWin = await prisma.spin_win_user_record.findMany({
            where,
            orderBy: { date_created: 'desc' },
            skip,
            take,
        });
        
        res.status(200).json({
            status: true,
            message: "Spin win fetched successfully",
            count: spinWinCount,
            totalActive,
            totalInactive,
            data: spinWin,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const softDeleteSpinWin = async (req, res, next) => {
    try {
        const { id } = req.params;
       
       await softDelete('spin_win_user_record','id',Number(id));       
       
        res.status(200).json({
            status: true,
            message: "Spin win deleted successfully"
        })
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}
export const enrollInfluencerSpinWin= async(req, res, next)=>
{
        try {
            const { id } = req.params;
            const { influencer_type } = req.body;
            await prisma.spin_win_user_record.update({
                where: { id: Number(id) },
                data: {
                    influencer_type,
                    last_changed_on: new Date(),
                    last_changed_by_id: req.user.id,
                    last_changed_by_name: req.user.name
                }
            })
        
        res.status(200).json({status:true,message: "Badge enrolled successfully" });
        } catch(error) {
                console.log(error);
                next(error);
            }
  }

export const updateSpinWinStatus  = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // expecting boolean true/false

        await prisma.spin_win_user_record.update({
            where: { id: Number(id) },
            data: {
                status,
                last_updated_by: new Date(),
                last_updated_by_id: req.user.id,
                last_updated_by_name: req.user.name
            }
        }); 
        res.status(200).json({
            status: true,
            message: "Spin win updated successfully"
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}