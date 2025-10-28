import softDelete from "@shared/common/softDelete.js";
import prisma from "@shared/dbConfig/database.js";

export const createPointMaster = async (req, res,next) => {
    try {
        const {
            welcome_point,
            birthday_point,
            anniversary_point,
            transaction_incentive,
            registration_refferal,
            registration_refferal_own,
            site_point
        } = req.body;
        const { id, name } = req.user;
       
        const created = await prisma.point_master.create({
           data:{    
                created_by_id:id,
                created_by_name:name,
                welcome_point,
                birthday_point,
                anniversary_point,
                transaction_incentive,
                registration_refferal,
                registration_refferal_own,
                site_point
           }    },  

        )

        res.status(200).json({
            message: 'Point master Created successfully',
            data: created
        });

    } catch (err) {
        next(err)
    }
};

export const getALLPointMaster =async (req,res,next) => {
    const { page = 1, limit = 20, filters = {} } = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    try {
        const totalCount = await prisma.point_master.count();
      const fetchedData=  await prisma.point_master.findMany({where:{...filters,del:false},
        skip,
        take,
    });
        return res.status(201).json({status:true,message:"Successfully Fetched !",count:totalCount,data:fetchedData});
    } catch (error) {
        next(error);
        
    }
    
}

export const softDeletePointMaster = async (req, res, next) => {
    const { id } = req.params;
    try {
        await softDelete('point_master','id',Number(id));
        return res.status(200).json({status:true,message:"Successfully Deleted !"});
    } catch (error) {
        next(error);
    }
}

export const updatePointMaster = async (req, res, next) => {
try{
    const { id } = req.params;
    const {
        welcome_point,
        birthday_point,
        anniversary_point,
        transaction_incentive,
        registration_refferal,
        registration_refferal_own,
        site_point                                                          
}
    = req.body;
    const updated = await prisma.point_master.update({
        where: {
            id: Number(id),
        },
        data: {
            welcome_point,
            birthday_point,
            anniversary_point,
            transaction_incentive,
            registration_refferal,
            registration_refferal_own,
            site_point,
            last_updated_by:req.user.id,
            last_updated_by_name:req.user.name,
            last_updated_on: new Date()
        }
    })
    return res.status(200).json({status:true,message:"Successfully Updated !",data:updated});
}catch(err){
    next(err);
}
}