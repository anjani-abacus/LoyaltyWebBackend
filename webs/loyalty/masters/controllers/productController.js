import softDelete from "@shared/common/softDelete.js";
import prisma from "@shared/dbConfig/database.js";
import { config } from "@shared/utils/env.js";
import buildPrismaFilters from "@shared/common/buildPrismaFilters.js";

// creating point category 
 export  const createpointCatgeory = async (req, res, next) => {
    try {
   
        const { point_category_name, influencer_point }  = req.body;
    const { id, name } = req.user;
        const createdData = await prisma.point_category_master.create({
            data: {
                point_category_name,
                influencer_point,
                created_by_id:id,
                created_by_name:name
            }  
      },
        )

            return res.status(201).json({status:true,message:"Successfully Created!",data:createdData})
    } catch (error) {
        next(error)
    }
}
export const getAllPointCategory = async (req, res, next) => {
try {
        const { page = 1, limit = 20, filters = {} } = req.body;
        const data = await prisma.point_category_master.findMany({where:{...filters,del:false},
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            orderBy: { id: 'desc' }
        });
        const totalCount = await prisma.point_category_master.count();
        return res.status(201).json({status:true,message:"Successfully Fetched !",count:totalCount.length,data:data});
} catch (error) {
    next(error)
}}

export const updatePointCategory = async (req, res, next) => {
try {
    const { id } = req.params;
    const { point_category_name, influencer_point }  = req.body;
    const UpdatedData = await prisma.point_category_master.update({
        where: {
            id: Number(id),
        },
        data: {
            point_category_name,
            influencer_point,
            last_updated_by:req.user.id,
            last_updated_by_name:req.user.name,
            last_updated_on: new Date()
        }
    })
    return res.status(200).json({status:true,message:"Successfully Updated !",data:UpdatedData});
} catch (error) {
    next(error);
}

}
export const deletePointCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        await softDelete('point_category_master','id',Number(id))
        return res.status(200).json({status:true,message:"Successfully Deleted !"});
    } catch (error) {
        next(error);
    }
}
// creating product
export const upsertProduct = async (req, res, next) => {
    const {
        product_name,
        product_code,
        mrp,
        brand,
        uom,
        product_size,
        master_packing_size,
        small_packing_size,
        product_scan,
        description,
        qty,
        point_category_id,
        point_category_name,
        category_id,
        category_name,
        sub_category_id,
        sub_category_name
    } = req.body;

    const image = `${config.s3.publicUrl}/${req.file.key}`;
    const {id,name }= req.user 
    try {
        // 1. Upsert Product
        const product = await prisma.master_product.create({
        data: {
                product_name,
                product_code,
                mrp,
                brand,
                uom,
                product_size,
                master_packing_size,
                small_packing_size,
                product_scan,
                description,
                point_category_id,
                point_category_name,
                qty,
                category_id,
                category_name,
                sub_category_id,
                sub_category_name,
                date_created: new Date(),
                created_by_id:id,
                created_by_name:name,
            }
    })

        // 2. Upload image to master_product_images
        if (image) {
            await prisma.master_product_images.create({
                data: {
                    product_id: product.id,
                    image,
                    created_by_id:id,
                    created_by_name:name,
                    date_created: new Date(),
                }        
                },
            );
        }


        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error("Upsert Error:", error);
        next(error);
    }
};

export const getAllProducts = async (req, res,next) => {
    const { page = 1, limit = 20, filters = {} } = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    try {
        const fieldTypes = {
            category_name: "string",
            sub_category_name: "string",
            product_name: "string",
            product_code: "string",
            brand: "string",
            status: "boolean",
            date_created: "date"
        };

        const where = buildPrismaFilters(filters, fieldTypes);
        const productsCount = await prisma.master_product.findMany();
        const products = await prisma.master_product.findMany({where,
            orderBy: {date_created: 'desc' },
            skip,
            take,
        });
        const totalActive = productsCount.filter(c => c.status === true || c.status === 'true').length;
        const totalInactive = productsCount.length - totalActive;
        res.status(200).json({ success: true, count:productsCount.length,
            totalActive,
            totalInactive
             ,data:products });
    } catch (error) {
        next(error)
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const deleteProduct = async (req, res, next) => {
    const { id } = req.params;

    try {
        
        await softDelete('master_product','id',Number(id))

        res.status(200).json({ success: true, message: "Product soft deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const updateProductStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // check if product exists
        const existing = await prisma.master_product.findUnique({
            where: { id: Number(id) },
        });

        if (!existing || existing.del) {
            return res.status(404).json({ message: "Product not found or deleted" });
        }

        const updated = await prisma.master_product.update({
            where: { id: parseInt(id) },
            data: {
                status,
                last_update_date: new Date(),
                last_update_by: req.user.id,
                last_updated_by_name: req.user.name,
            },
        });

        res.status(200).json({
            success: true,
            message: "Product status updated successfully",
            data: updated,
        });
    } catch (error) {
        console.error("Update Product Status Error:", error);
        next(error);
    }
};
