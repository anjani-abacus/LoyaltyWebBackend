import prisma from "@shared/dbConfig/database.js";
import softDelete from "@shared/common/softDelete.js";

export const createFaq = async (req, res,next) => {
    const {user_type,faq_type, question, answer } = req.body;
    try {
        const newFaq = await prisma.faq.create({
            data: {
                user_type,
                faq_type,
                question,
                answer,
            },
        });
        res.status(201).json({status:true,message:"SuccessFully Created!",data:newFaq});
        } catch (error) {
        res.status(500).json({ error: 'Failed to create FAQ' });
        next(error);
            }
    }

export const getAllFaq = async (req, res,next) => {
        try {
            const faqs = await prisma.faq.findMany({
                where: {
                    del: false,
                },
            });
            res.status(200).json({status:true,message:"SuccessFully Created!",data:faqs});      
            } catch (error) {
            res.status(500).json({ error: 'Failed to fetch FAQs' });
            next(error);
                }
        }

export const getFaqById = async (req, res,next) => {
    const { id } = req.params;
    try {
        const faq = await prisma.faq.findFirst({
            where: {
                id: parseInt(id),
            },
        });

        if (!faq) {
            return res.status(404).json({ error: 'FAQ not found' });

        }
        return res.status(201).json({status:true,message:"SuccessFully Fetched!",data:faq})
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch FAQ' });
        next(error);
    }
}
export const getFaqByUserType = async (req, res,next) => {
    const { user_type } = req.params;
    try {
        const faq = await prisma.faq.findMany({
            where: {
                user_type: user_type,
            },
        }
    )
    if(!faq){
        return res.status(404).json({ error: 'FAQ not found' });        
        }
    
        return res.status(201).json({ message: 
            "SuccessFully Fetched!",data:faq });
}catch (error) {
  res.status(500).json({ error: 'Failed to fetch FAQ' });
    next(error)
}}

export const getFaqByFaqType = async (req, res,next) => {
    const { faq_type } = req.params;
    try {
        const faq = await prisma.faq.findMany({
            where: {
                faq_type: faq_type,
            },
        }
    )
        if (!faq) {
            return res.status(404).json({ error: 'FAQ not found' });
        }

        return res.status(201).json({
            message:
                "SuccessFully Fetched!", data: faq
        });        
}catch (error) {
   res.status(500).json({ error: 'Failed to fetch FAQ' });
    next(error)
}}

export const updateFaq = async (req, res,next) => {
    const { id } = req.params;
    const { user_type, faq_type, question, answer } = req.body; 

    try{
        const updatedFaq = await prisma.faq.update({
            where: {
                id: parseInt(id),
            },
            data: {
                user_type,
                faq_type,
                question,
                answer,
            },
        });
        res.status(200).json({status:true,message:"SuccessFully Updated!",data:updatedFaq});

    }catch (error) {
        res.status(500).json({ error: 'Failed to update FAQ' });
        next(error);
    }
}

export const deleteFaq = async (req, res,next) => {
    const { id } = req.params;
    try {
        const deletedFaq = await softDelete('faq', 'id',Number(id));
        res.status(200).json({status:true,message:"SuccessFully Deleted!",data:deletedFaq});    
        } catch (error) {
        res.status(500).json({ error: 'Failed to delete FAQ' });
        next(error);
            }
    }