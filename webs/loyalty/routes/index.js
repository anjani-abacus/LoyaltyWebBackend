import express from 'express';
import authRoute from '../auth/routes/authRoutes.js';
import bonusRouter from '../Bonus/routes/bonusRoutes.js';
import couponRouter from '../GenerateQR/routes/generateCouponRoutes.js';
import giftGalleryRoutes from '../GiftGallery/routes/giftGalleryRoutes.js';
import masterRoute from '../masters/routes/masterRoutes.js';
import influencerRouter from '../NetworkInfluencer/routes/influencerRoutes.js';
import redeemRouter from '../RedeemRequest/routes/redeemRequestRoutes.js';
import uploadRouter from '../uploadCSV/routes/uploadBulkFilesRoutes.js';
import dashboardRoutes from '../Dashboard/routes/dashboardRoutes.js';
import postAndEarnRouter from '../postAndEarn/routes/postAndEarnRoutes.js';
import streakRouter from '../streaks/routes/streaksRoutes.js';
import productCSVRouter from '../masters/exportCSV/exportProducts.js';
import influencerCSVRouter from '../NetworkInfluencer/exportCSV/exportProducts.js';
import QRCouponsCSVRouter from '../GenerateQR/exportCSV/exportProducts.js';
import redeemRequestCsv from '../RedeemRequest/exportCSV/exportRedeemRequest.js';
import leaderboardRouter from '../leader/routes/leaderboardRoutes.js';
import faqRoutes from '../faq/routes/faqRoutes.js';
import companyRoutes from '../CompnayContact/routes/companyRoutes.js';
import bannerRoutes from '../bannerModule/routes/bannerRoutes.js';
import tutorialRoutes from '../tutorialMaster/routes/tutorialRoutes.js';
import reportRouter from '../Reports/routes/reportRoutes.js';
import ticketRoutes from '../Tickets/routes/ticketRoutes.js';

const loyaltyRoutes = express.Router();

loyaltyRoutes.use('/', authRoute);
loyaltyRoutes.use('/', bonusRouter);
loyaltyRoutes.use('/', couponRouter);
loyaltyRoutes.use('/', giftGalleryRoutes);
loyaltyRoutes.use('/', masterRoute);
loyaltyRoutes.use('/', influencerRouter);
loyaltyRoutes.use('/', redeemRouter);
loyaltyRoutes.use('/', uploadRouter);
loyaltyRoutes.use('/', dashboardRoutes); 

// Apps Specific 
loyaltyRoutes.use('/',postAndEarnRouter);
loyaltyRoutes.use('/', streakRouter);
loyaltyRoutes.use('/', leaderboardRouter);
loyaltyRoutes.use('/', faqRoutes);
loyaltyRoutes.use('/', companyRoutes);
loyaltyRoutes.use('/', bannerRoutes);
loyaltyRoutes.use('/',tutorialRoutes)
loyaltyRoutes.use('/',ticketRoutes);


// CSV Routes
loyaltyRoutes.use('/', productCSVRouter)
loyaltyRoutes.use('/', influencerCSVRouter)
loyaltyRoutes.use('/', QRCouponsCSVRouter)
loyaltyRoutes.use('/', redeemRequestCsv)


// Report Routes
loyaltyRoutes.use('/',reportRouter)
export default loyaltyRoutes;
