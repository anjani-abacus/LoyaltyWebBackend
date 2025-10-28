import { Parser } from 'json2csv';
import express from 'express';
import buildPrismaFilters from '@shared/common/buildPrismaFilters.js';
import prisma from '@shared/dbConfig/database.js';

const QRCouponsCSVRouter = express.Router();

QRCouponsCSVRouter.post('/export_QRCoupons_csv', async (req, res, next) => {
    const { filters = {} } = req.body;
    const fieldTypes = {
        category: "string",
        status: "boolean",
        date_created: "date",
        point_category_name: "string",
        product_id: "number",
        product_detail: "string",
        product_code: "string",
        coupon_code: "string"
    };
    try {
        const where = buildPrismaFilters(filters, fieldTypes);
        const products = await prisma.offer_coupon.findMany({
            where,
            orderBy: { date_created: 'desc' }
        });

        if (!products.length) {
            return res.status(404).send('No QR Coupon found');
        }

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(products);

        res.header('Content-Type', 'text/csv');
        res.attachment('QrCouponsRecord.csv');
        res.send(csv);
    } catch (error) {
        console.error('CSV generation error:', error);
        res.status(500).send('Error generating CSV');
    }
});

export default QRCouponsCSVRouter;
