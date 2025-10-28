import softDelete from "@shared/common/softDelete.js";
import prisma from "@shared/dbConfig/database.js";
import redisClient from '@shared/dbConfig/redis.js'
import buildPrismaFilters from "@shared/common/buildPrismaFilters.js";

export const createInfluencer = async (req, res, next) => {
    try {
        const {
            name, email, mobile, country, birth_date, pincode,wedding_date,
            state, address, district, city, area,work_anniversary_date,
            kyc_document_type, document_no, pan_no, user_redeemption_prefrence,
            upi_id, account_holder_name, bank_name, ifsc_code, account_no, influencer_type_name
        } = req.body;
        if(!mobile){
            return res.status(400).json({ message: "Mobile number is required" });
        }
        const existingInfluencer = await prisma.influencer_customer.findFirst({
            where: { mobile },
        });

        if (existingInfluencer) {
            return res.status(400).json({ message: "Influencer with this mobile number already exists" });
        }

 
        const files = req.files || {};
        const document_img_front = files?.document_img_front?.[0]?.key
            ? `${process.env.S3_PUBLIC_URL}/${files.document_img_front[0].key}`
            : undefined;
        const document_img_back = files?.document_img_back?.[0]?.key
            ? `${process.env.S3_PUBLIC_URL}/${files.document_img_back[0].key}`
            : undefined;
        const document_pan_img = files?.document_pan_img?.[0]?.key
            ? `${process.env.S3_PUBLIC_URL}/${files.document_pan_img[0].key}`
            : undefined;
        const document_bank_img = files?.document_bank_img?.[0]?.key
            ? `${process.env.S3_PUBLIC_URL}/${files.document_bank_img[0].key}`
            : undefined;

      

        const influencer = await prisma.influencer_customer.create({
            data: {
                name,
                email,
                country,
                mobile,
                wedding_date: wedding_date ? new Date(wedding_date) : new Date(),
                birth_date: birth_date ? new Date(birth_date) : new Date(),
                work_anniversary_date: work_anniversary_date ? new Date(work_anniversary_date) : new Date(),
                pincode,
                state,
                address,
                district,
                city,
                area,
                kyc_document_type,
                document_no,
                document_img_front,
                document_img_back,
                pan_no,
                document_pan_img,
                user_redeemption_prefrence,
                upi_id,
                account_holder_name,
                bank_name,
                ifsc_code,
                account_no,
                document_bank_img,
                influencer_type_name,
                created_by_id: req.user.id,
                created_by_name: req.user.name,
                last_wallet_update: new Date(),
            },
        });

        return res.status(201).json({
            message: `Successfully Created User With ID:${influencer.id}`,
            data: influencer
        });

    } catch (error) {
        next(error);
    }
};
export const updateInfluencer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { 
            name, email, mobile, country, birth_date, work_anniversary_date, pincode,
            state,  district, city, area, 
            kyc_document_type, document_no, pan_no, user_redeemption_prefrence,
            upi_id, account_holder_name, bank_name, ifsc_code, account_no, influencer_type_name,address
        } = req.body;
       

        const existingInfluencer = await prisma.influencer_customer.findUnique({
            where: {id: Number(id)},
        });

        if (!existingInfluencer) {
            return res.status(404).json({ message: "Influencer not found with this mobile number" });
        }

        const files = req.files || {};
        const document_img_front = files?.document_img_front?.[0]?.key
            ? `${process.env.S3_PUBLIC_URL}/${files.document_img_front[0].key}`
            : undefined;
        const document_img_back = files?.document_img_back?.[0]?.key
            ? `${process.env.S3_PUBLIC_URL}/${files.document_img_back[0].key}`
            : undefined;
        const document_pan_img = files?.document_pan_img?.[0]?.key
            ? `${process.env.S3_PUBLIC_URL}/${files.document_pan_img[0].key}`
            : undefined;
        const document_bank_img = files?.document_bank_img?.[0]?.key
            ? `${process.env.S3_PUBLIC_URL}/${files.document_bank_img[0].key}`
            : undefined;

        const updatedInfluencer = await prisma.influencer_customer.update({
            where: { id :Number(id)},
            data: 
                {
                name,
                email,
                country,
                mobile,
                ...(birth_date && { birth_date: new Date(birth_date) }),
                ...(work_anniversary_date && { work_anniversary_date: new Date(work_anniversary_date) }),
                pincode,
                state,
                district,
                city,
                area,
                address,
                kyc_document_type,
                document_no,
                document_img_front,
                document_img_back,
                pan_no,
                document_pan_img,
                user_redeemption_prefrence,
                upi_id,
                account_holder_name,
                bank_name,
                ifsc_code,
                account_no,
                document_bank_img,
                influencer_type_name,
                created_by_id: req.user.id,
                created_by_name: req.user.name
                }
        });

        return res.status(200).json({ message: "Influencer updated successfully", data: updatedInfluencer });
    } catch (error) {
        next(error);
    }
};
export const UpdateInfluencerKyc = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { kyc_status, kyc_remark } = req.body;

        const existingInfluencer = await prisma.influencer_customer.findUnique({
            where: { id: Number(id) },
        });
        if (!existingInfluencer) {
            return res.status(404).json({ message: "Influencer not found with this id" });
                
        }
        const updatedInfluencer = await prisma.influencer_customer.update({
            where: { id: Number(id) },
            data: {
                kyc_status,
                kyc_remark,
                kyc_verified_by_id: req.user.id,
                kyc_verified_by_name: req.user.name,
                kyc_verified_date: new Date(),
            },
        });
        return res.status(200).json({ message: "Influencer KYC updated successfully", data: updatedInfluencer });
    }
    catch (error) {
        next(error);
    }
};
export const UpdateInfluencerProfileStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status_of_profile } = req.body;
        const existingInfluencer = await prisma.influencer_customer.findUnique({
            where: { id: Number(id) },
        });

        if (!existingInfluencer) {
            return res.status(404).json({ message: "Influencer not found with this id" });
                
                
        }   
        const updatedInfluencer = await prisma.influencer_customer.update({
            where: { id: Number(id) },
            data: {
                status_of_profile,
                status_change_by: req.user.id,
                status_change_by_name: req.user.name,
                status_change_date: new Date(),   
            },
        });
        return res.status(200).json({ message: "Influencer status updated successfully", data: updatedInfluencer });
    }   
    catch (error) {
        next(error);
    }           
};
export const UpdateInfluencerActiveStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { active_status } = req.body;
        
        if (!id) {
            return res.status(400).json({ success: false, message: "userId is required" });
        }

      const result =  await prisma.influencer_customer.update({
            where: { id: Number(id) },
            data: { 
                active_status,
                active_status_change_by_id:req.user.id,
                active_status_change_by_name:req.user.name,
                active_status_changed_date:new Date(),  
            },
        });

        await redisClient.del(`user:${id}:accessToken`);
        await redisClient.del(`user:${id}:refreshToken`);

        return res.json({ success: true, message: "User Active Status Updated Successfully", ActiveStatus: result.active_status});

    } catch (error) {
        return next(error);
    }
};
export const UpdateInfluencerTypeName = async (req, res, next) => {

    try {
        const{influencer_type_name}=req.body;
        const { id } = req.params;
      const data = await prisma.influencer_customer.update({
        where: { id: Number(id) },
        data: {
          influencer_type_name,
        },
      });
      return res.status(200).json({ message: "Influencer type name updated successfully", data: data });
    } catch (error) {
next(error);
    }
}
export const getInfluencerList = async (req, res, next) => {
    try {
        const { page = 1, limit = 50, filters = {} } = req.body;

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const fieldTypes = {
            date_created: "date",
            status_of_profile: "enum",
            kyc_status: "enum",
            name: "string",
            mobile: "string",
            state: "string",
            district: "string",
            id:"number"
        };

        const where = buildPrismaFilters(filters, fieldTypes);

        // Make a shallow copy for tab counts
        const whereForCounts = { ...where };
        delete whereForCounts.status_of_profile;

        const [totalCount, influencers, statusCountsRaw] = await Promise.all([
            prisma.influencer_customer.count({ where }),
            prisma.influencer_customer.findMany({
                where,
                orderBy: { date_created: "desc" },
                skip,
                take,
            }),
            prisma.influencer_customer.groupBy({
                by: ["status_of_profile"],
                _count: { _all: true },
                where: whereForCounts, //  no status filter here
            }),
        ]);


        // Transform status counts
        const statusCounts = statusCountsRaw.reduce((acc, item) => {
            acc[item.status_of_profile] = item._count._all;
            return acc;
        }, {});

        return res.status(200).json({
            message: "Influencers fetched successfully",
            page: Number(page),
            limit: Number(limit),
            totalCount,
            totalPages: Math.ceil(totalCount / take),
            TabList: [
                { key: "Pending", count: statusCounts.PENDING || 0 },
                { key: "Approved", count: statusCounts.APPROVED || 0 },
                { key: "Reject", count: statusCounts.REJECT || 0 },
            ],
            data: influencers,
        });
    } catch (error) {
        console.error("Error fetching influencer list:", error);
        next(error);
    }
};


export const getInfluencerById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const influencer = await prisma.influencer_customer.findUnique({
            where: {id: Number(id) ,del:false},
        });
        
        if (!influencer) {
            return res.status(404).json({ message: "Influencer not found" });
        }
        return res.status(200).json({ message: "Influencer fetched successfully", data: influencer });
    } catch (error) {
        next(error);
    }
};

export const softDeleteInfluencer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const influencer = await prisma.influencer_customer.findUnique({ where: { id: Number(id) } });
        if (!influencer) return res.status(404).json({ message: 'Not found' });
        await softDelete('influencer_customer', 'id', parseInt(id));
        const redisKey = `influencers:byUser:${influencer.created_by_id}`;
        await redisClient.hDel(redisKey, influencer.mobile);
        res.status(200).json({ message: 'Influencer Customer deleted successfully' });
    } catch (error) {
        next(error);
    }
}
