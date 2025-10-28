import { Parser } from 'json2csv';
import express from 'express';
import buildPrismaFilters from '@shared/common/buildPrismaFilters.js';
import prisma from '@shared/dbConfig/database.js';

const redeemRequestCsv = express.Router();

redeemRequestCsv.post('/export_redeem_request_csv', async (req, res, next) => {
    const { filters = {} } = req.body;
    const fieldTypes = {
        req_id: "string",
        status: "boolean",
        date_created: "date",
        gift_type: "enum",
        action_status: "enum",
        user_name: "string",
        user_mobile: "string",
        bank_name: "string",
        account_number: "string",
        ifsc_code: "string",
        upi_id: "string",
        state: "string",
        district: "string",
    };
    try {
        const where = buildPrismaFilters(filters, fieldTypes);
        const products = await prisma.gift_redeem_request.findMany({
            where,
            orderBy: { date_created: 'desc' }
        });

        if (!products.length) {
            return res.status(404).send('No Gift Redeem Request found');
        }

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(products);

        res.header('Content-Type', 'text/csv');
        res.attachment('GiftReedemRequest.csv');
        res.send(csv);
    } catch (error) {
        console.error('CSV generation error:', error);
        res.status(500).send('Error generating CSV');
    }
});

export default redeemRequestCsv;
