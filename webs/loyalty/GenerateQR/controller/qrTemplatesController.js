import softDelete from "@shared/common/softDelete.js";
import prisma from "@shared/dbConfig/database.js";

export const createqrTemplate =async(req,res,next)=>{
    const { size }=req.body;
    const temp_image = req?.file?.location;
    const { id, name } = req.user;
    try {
        const data=await prisma.qr_template.create({
            data:{
                size,
                temp_image,
                created_by_id:id,
                created_by_name:name
            }           },
        )
        res.status(201).json({status:true,message:"Successfully Created", data:data})
    } catch (error) {
        next(error)
    }
}

export const getAllQrTemplates = async(req,res,next)=>{
    try {
        const data=await prisma.qr_template.findMany({
            where:{
                del:false
            }
        });
        res.status(200).json({status:true,message:"Successfully Fetched", data:data})
    } catch (error) {
        next(error)
    }
}
export const softDeleteQrTemplate = async(req,res,next)=>{
    try {
        const { id } = req.params;
        await softDelete('qr_template','id',Number(id));
        res.status(200).json({status:true,message:"Successfully Deleted"})
    } catch (error) {
        next(error)
    }
}