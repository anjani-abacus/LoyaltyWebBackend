import { Parser } from 'json2csv';
import express from 'express';
import buildPrismaFilters from '@shared/common/buildPrismaFilters.js';
import prisma from '@shared/dbConfig/database.js';

const productCSVRouter = express.Router();

productCSVRouter.post('/export_product_csv', async (req, res, next) => {
    const { filters = {} } = req.body;
    const fieldTypes = {
        category_name: "string",
        sub_category_name: "string",
        product_name: "string",
        product_code: "string",
        brand: "string",
        status: "boolean",
        date_created: "date"
    };
    try {
        const where = buildPrismaFilters(filters, fieldTypes);
        const products = await prisma.master_product.findMany({
            where,
            orderBy: { date_created: 'desc' }
        });

        if (!products.length) {
            return res.status(404).send('No products found');
        }

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(products);

        res.header('Content-Type', 'text/csv');
        res.attachment('products.csv');
        res.send(csv);
    } catch (error) {
        console.error('CSV generation error:', error);
        res.status(500).send('Error generating CSV');
    }
});

export default productCSVRouter;
