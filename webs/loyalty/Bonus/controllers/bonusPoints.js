import softDelete from "@shared/common/softDelete.js";
import prisma from "@shared/dbConfig/database.js";
import redisClient from '@shared/dbConfig/redis.js';
import buildPrismaFilters from "@shared/common/buildPrismaFilters.js";


export const getstate=async (req,res,next) => {
    try {
        const states = await prisma.abq_postal_master.findMany({
            select: {
                state_name: true
            },
            distinct: ['state_name'],
            orderBy: {
                state_name: 'asc'
            }
        })
        const stateNames = states.map(state => state.state_name);
        res.status(200).json({status:true,message:"Successfully Fetched State !",data:stateNames});
    } catch (error) {
        next(error)
    }
}
export const getdistrictofstate=async (req,res,next) => {
    const{state_name}=req.body;
    try {
      const getDistrict =   await prisma.abq_postal_master.findMany({where:{state_name},
        select:{
         district_name:true
        },
        distinct: ['district_name'],
        orderBy: {
            district_name: 'asc'
        }
    }
      )
        const districtNames = getDistrict.map(state => state.
            district_name);
      res.status(201).json({status:true,message:"Successfully Fetched District !",data:districtNames});
    } catch (error) {
        next(error)
    }   
}

export const getStatesByRedis = async (req, res, next) => {
    const REDIS_KEY = 'states:list';

    try {
        // 1. Check Redis cache
        const cachedData = await redisClient.get(REDIS_KEY);
        if (cachedData) {
            const data = JSON.parse(cachedData);
            if (data.length) {
                return res.status(200).json({
                    status: true,
                    message: "Successfully fetched states (from cache)!",
                    data
                });
            }
        }

        // 2. Fetch from DB
        const states = await prisma.abq_postal_master.findMany({
            select: { state_name: true },
            distinct: ['state_name'],
            orderBy: { state_name: 'asc' }
        });

        const stateNames = states.map(s => s.state_name);

        // 3. Cache only if data exists
        if (stateNames.length) {
            await redisClient.set(REDIS_KEY, JSON.stringify(stateNames));
        }

        res.status(200).json({
            status: true,
            message: "Successfully fetched states!",
            data: stateNames
        });

    } catch (error) {
        next(error);
    }
};
export const getDistrictsByStateRedis = async (req, res, next) => {
    const { state_name } = req.body;

    if (!state_name) {
        return res.status(400).json({ status: false, message: "state_name is required" });
    }

    // Normalize key (lowercase, trim)
    const REDIS_KEY = `districts:state:${state_name.toLowerCase().trim()}`;

    try {
        // 1. Check cache
        const cachedData = await redisClient.get(REDIS_KEY);
        if (cachedData) {
            const data = JSON.parse(cachedData);
            if (data.length) {
                return res.status(200).json({
                    status: true,
                    message: "Successfully fetched districts (from cache)!",
                    data
                });
            }
        }

        // 2. Fetch from DB
        const districts = await prisma.abq_postal_master.findMany({
            where: { state_name },
            select: { district_name: true },
            distinct: ['district_name'],
            orderBy: { district_name: 'asc' }
        });

        const districtNames = districts.map(d => d.district_name);

        // 3. Cache only if data exists
        if (districtNames.length) {
            await redisClient.set(REDIS_KEY, JSON.stringify(districtNames));
        }

        res.status(200).json({
            status: true,
            message: "Successfully fetched districts!",
            data: districtNames
        });

    } catch (error) {
        next(error);
    }
};


export const createBonusPoints = async (req, res, next) => {
    const {
        influencer_type,
        title,
        start_date,
        end_date,
        state,
        district,
        points = [],
    } = req.body;

    const { id, name } = req.user;

    try {
        const exisiting = await prisma.bonus_master.findFirst({
            where: {
                influencer_type,
                title
            }
            });
        if (exisiting) {
            return res.status(400).json({
                status: false,
                message: "Bonus points with This Title already exists"
            });
        }
        const bonus_master = await prisma.bonus_master.create({
            data: {
                influencer_type,
                title,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                state,
                district,
                created_by_id: id,
                created_by_name: name,
            }
        },       
        
    );

        const pointsArray = Array.isArray(points) ? points : [points];

        const bonusPointsData = pointsArray
            .filter(p => p && p.point_category_id)
            .map((p) => ({
                bonus_id: bonus_master.id,
                point_category_id: Number(p.point_category_id),
                point_category_name: p.point_category_name,
                point: Number(p.point),
                created_by_id: id,
                created_by_name: name,
            }));

        if (bonusPointsData.length > 0) {
            await prisma.bonus_product_point.createMany({
                data: bonusPointsData,
            },          );
        }

        res.status(200).json({
            status: true,
            message: "Bonus points created successfully",
            data: {
                bonus_master,
                points: bonusPointsData,
            },
        });
    } catch (error) {
        console.error("Error creating bonus points:", error);
        next(error);
    }
};

export const getBonusPoints = async (req, res, next) => {
    const {page = 1, limit = 20 ,filters={}} = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    
    try {
        const fieldTypes = {
            date_created: "date",
            influencer_type: "string",
            title: "string",
            state: "string",
            district: "string",
            start_date: "date",
            end_date: "date"
        };

        const where = buildPrismaFilters(filters, fieldTypes);
        const bonusPoints = await prisma.bonus_master.count();
        const totalActive = await prisma.bonus_master.count({ where: { status: true } });
        const totalInactive = bonusPoints - totalActive;

        const bonusPointsData = await prisma.bonus_master.findMany({
            where,
            skip,
            take,
        });
        
        res.status(200).json({
            status: true,
            message: "Bonus points fetched successfully",
            count:bonusPoints,
            totalActive,
            totalInactive,  
            data: bonusPointsData
        })
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}

export const softDeleteBonusPoints = async (req, res, next) => {
    const { id } = req.params;
    try {
        
        await softDelete('bonus_master','id',Number(id))

        res.status(200).json({
            status: true,
            message: "Bonus points deleted successfully"
        })
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}

export const updateBonusPointsStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    try {   
        const existingBonus = await prisma.bonus_master.findUnique({
            where: { id: Number(id) }
        });
        if (!existingBonus) {
            return res.status(404).json({
                status: false,
                message: "Bonus points not found"
            });
        }
        await prisma.bonus_master.update({
            where: { id: Number(id) },
            data: { status,
                updated_by:Number(req.user.id),updated_at:new Date() 
             }
        });
        res.status(200).json({
            status: true,
            message: "Bonus points updated successfully"
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }   
}