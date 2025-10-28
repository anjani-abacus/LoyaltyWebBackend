import prisma from "../dbConfig/database.js";

 const softDelete = async (tableName, columnName, value) => {
    await prisma[tableName].update({
        where: {
            [columnName]: value,
        },
        data: { del: true },
    });
};

export default softDelete;

// usage
// await softDelete('product', 'product_id', 1);