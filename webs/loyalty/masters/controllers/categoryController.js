import prisma from "@shared/dbConfig/database.js";
import  buildPrismaFilters from "@shared/common/buildPrismaFilters.js";
export const createCategory = async (req, res, next) => {
    const { category, direct_dealer_discount, retailer_discount, gst } = req.body; 
    const { id, name } = req.user;
    try {
        const Data = await prisma.master_category.create({
             data: { category: category,
                 direct_dealer_discount: parseFloat(direct_dealer_discount), 
                 retailer_discount: parseFloat(retailer_discount), 
                 gst: parseFloat(gst),
                 created_by_id:id,
                 created_by_name:name,
                 status: true
                 }       },
            )
        res.status(201).json({ success: true, message: "SuccessFully Created!", category: Data });
    } catch (error) {
        next(error)
    }
}

export const getAllCategory = async (req, res, next) => {
    const { page = 1, limit = 100, filters = {} } = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const fieldTypes = {
        category: "string",
        status: "boolean",
        date_created: "date"
    };

    const where = buildPrismaFilters(filters, fieldTypes);

    try {
        // Efficient counts using Prisma
        const total = await prisma.master_category.count();
        const totalActive = await prisma.master_category.count({ where: { status: true } });
        const totalInactive = total - totalActive;

        // Paginated fetch
        const category = await prisma.master_category.findMany({
            where,
            skip,
            take,
            orderBy: { date_created: 'desc' }
        });

        return res.status(200).json({
            success: true,
            total,
            totalActive,
            totalInactive,
            category,
        });

    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    const { id } = req.params; 
    const { category, direct_dealer_discount, retailer_discount, gst } = req.body;
    try {
        const existingCategory = await prisma.master_category.findUnique({ where: { id: Number(id), del: false } });
        if (!existingCategory || existingCategory.del) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const updated = await prisma.master_category.update({
            where: { id: parseInt(id) },
            data: {
                category: category,
                direct_dealer_discount: direct_dealer_discount,
                retailer_discount: retailer_discount,
                gst: gst,
                last_update_by  :req.user.id,   
                last_update_date : new Date(), 
                last_updated_by_name :req.user.name 
            }
        });

        res.status(200).json({ success: true, message: "Category updated", category: updated });
} catch (error) { 
    next(error); 
} }; 
export const updatestatusofcategory = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        
        const existingCategory = await prisma.master_category.findUnique({ where: { id: Number(id), del: false } });
        if (!existingCategory || existingCategory.del) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        const updated = await prisma.master_category.update({
            where: { id: parseInt(id) },
            data: { 
                status: status,
                last_update_by  :req.user.id,   
                last_update_date : new Date(), 
                last_updated_by_name :req.user.name 
             }
        });
        res.status(200).json({ success: true, message: "Category status updated", category: updated });
} catch (error) { next(error); } };

export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const existingCategory = await prisma.master_category.findUnique({
            where: { id: Number(id) },
        });

        if (!existingCategory || existingCategory.del) {
            return res.status(404).json({ success: false, message: "Category not found or already deleted" });
        }

        await prisma.master_category.update({
            where: { id: parseInt(id) },
            data: { del: true },
        });

        res.status(200).json({ success: true, message: "Category soft deleted successfully" });


} catch (error) { next(error); } };

export const createSUBCategory = async (req, res, next) => {
    const { master_category_id, master_category_name,sub_category_name } = req.body; 
    const { id, name } = req.user;
    try {
        const Data = await prisma.master_sub_category.create({ data: { master_category_id, master_category_name, sub_category_name, created_by_id:id, created_by_name :name}},

        )
        res.status(201).json({ success: true, category: Data });
    } catch (error) {
        next(error)
    }
}
export const getAllSUBCategory = async (req, res, next) => {
    const { page = 1, limit = 20 ,filters={}} = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    try {
        const totalCount = await prisma.master_sub_category.count();
        const totalActive = await prisma.master_sub_category.count({ where: { status: true, del: false } });
        const totalInactive = await prisma.master_sub_category.count({ where: { status: false, del: false } });
        const subcategory = await prisma.master_sub_category.findMany({ where: { ...filters,del: false },
                skip,
                take,
                 orderBy: { id: 'desc' } 
                })         
  
        return  res.status(200).json({
            success: true,
            count: totalCount,
            totalActive,
            totalInactive,
            data:subcategory
        });




    } catch (error) { next(error); }
};
export const updateSubCategory = async (req, res, next) => {
    const { id } = req.params; 
    const { master_category_id, master_category_name,sub_category_name } = req.body;
    try {
        const existingSub = await prisma.master_sub_category.findUnique({ where: { id: Number(id), del: false } });
        if (!existingSub || existingSub.del) {
            return res.status(404).json({ success: false, message: "Subcategory not found" });
        }

        const updated = await prisma.master_sub_category.update({
            where: { id: parseInt(id) },
            data: {
                master_category_id, master_category_name, sub_category_name,
                created_by_id:req.user.id,
                created_by_name:req.user.name
            }
        });

        res.status(200).json({ success: true, message: "Subcategory updated", subcategory: updated });

} catch (error) { next(error); } }; 

export const updatestatusofsubcategory = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const existingSubCategory = await prisma.master_sub_category.findUnique({ where: { id: Number(id), del: false } });
        if (!existingSubCategory || existingSubCategory.del) {
            return res.status(404).json({ success: false, message: "Subcategory not found" });
        }
        const updated = await prisma.master_sub_category.update({
            where: { id: parseInt(id) },
            data: { status: status }
        });
        res.status(200).json({ success: true, message: "Subcategory status updated", subcategory: updated });
}    catch (error) { next(error); } };


export const deletesubCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const existingSubCategory = await prisma.master_sub_category.findUnique({
            where: { id: Number(id) },
        });

        if (!existingSubCategory || existingSubCategory.del) {
            return res.status(404).json({ success: false, message: "Subcategory not found or already deleted" });
        }

        await prisma.master_sub_category.update({
            where: { id: parseInt(id) },
            data: { del: true },
        });

        res.status(200).json({ success: true, message: "Subcategory soft deleted successfully" });

} catch (error) { next(error); } };
