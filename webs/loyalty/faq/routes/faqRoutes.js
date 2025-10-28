import express from 'express';
import { createFaq, deleteFaq, getAllFaq, getFaqByFaqType, getFaqById, getFaqByUserType, updateFaq } from '../controllers/faqControllers.js';
 const faqRoutes = express.Router();

 faqRoutes.post('/create_faq',createFaq);
 faqRoutes.get('/get_all_faq',getAllFaq);
 faqRoutes.get('/get_faq_by_id/:id',getFaqById);
 faqRoutes.get('/get_faq_by_user_type/:user_type',getFaqByUserType);
 faqRoutes.get('/get_faq_by_faq_type/:faq_type',getFaqByFaqType);
 faqRoutes.put('/update_faq/:id',updateFaq);
 faqRoutes.delete('/delete_faq/:id',deleteFaq
 );

 export default faqRoutes;