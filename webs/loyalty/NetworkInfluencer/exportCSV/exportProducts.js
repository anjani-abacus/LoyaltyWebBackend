import { Parser } from 'json2csv';
import express from 'express';
import buildPrismaFilters from '@shared/common/buildPrismaFilters.js';
import prisma from '@shared/dbConfig/database.js';

const influencerCSVRouter = express.Router();

influencerCSVRouter.post('/export_influencer_csv', async (req, res, next) => {
    const { filters = {} } = req.body;
    const fieldTypes = {
        date_created: "date",
        status_of_profile: "enum",
        kyc_status: "enum",
        name: "string",
        mobile: "string",
        state: "string",
        district: "string",
    };
    try {
        const where = buildPrismaFilters(filters, fieldTypes);
        const products = await prisma.influencer_customer.findMany({
            where,
            orderBy: { date_created: 'desc' }
        });

        if (!products.length) {
            return res.status(404).send('No Influencer found');
        }

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(products);

        res.header('Content-Type', 'text/csv');
        res.attachment('influencers.csv');
        res.send(csv);
    } catch (error) {
        console.error('CSV generation error:', error);
        res.status(500).send('Error generating CSV');
    }
});

export default influencerCSVRouter;
