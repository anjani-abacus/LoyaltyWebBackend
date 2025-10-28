import softDelete from "@shared/common/softDelete.js";
import prisma from "@shared/dbConfig/database.js";
import { config } from "../../../../shared/utils/env.js";

export const generatePdf = async (req, res, next) => {
    const { type, title } = req.body;
    const doc = `${config.s3.publicUrl}/${req.file?.key}`;
    const { id, name } = req.user;
    try {
        const pdf = await prisma.document_catalogue_master.upsert({
            where: {
                title,
                del: false,
            },
            update: {
                doc,
                created_by_id:id,
                created_by_name:name
            },
            create: {
                type,
                title,
                doc,
                created_by_id:id,
                created_by_name:name
            },
        });
        res.status(200).json({ message: "PDF generated successfully", pdf });
    } catch (error) {
        console.error("Error in generatePdf:", error);
        next(error);
    }
};

export const getAllPdfs = async (req, res, next) => {
    const { page = 1, limit = 20, filters = {} } = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    try {
        const pdfsCount = await prisma.document_catalogue_master.count();
        const pdfs = await prisma.document_catalogue_master.findMany({
            where: { ...filters, del: false },
            skip,
            take,
            orderBy: { id: 'desc' },
        });

        res.status(200).json({ message: "PDFs retrieved successfully",count:pdfsCount, data: pdfs });
    } catch (error) {
        console.error("Error in getAllPdfs:", error);
        next(error);
    }
}

export const deletePdf = async (req, res, next) => {
    const { id } = req.params;
    try {
        await softDelete('document_catalogue_master','id',Number(id));
        res.status(200).json({ message: "PDF deleted successfully"});
    } catch (error) {
        console.error("Error in deletePdf:", error);
        next(error);
    }
}