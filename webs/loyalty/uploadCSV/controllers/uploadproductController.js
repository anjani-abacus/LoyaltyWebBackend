import fs from "fs";
import csv from "csv-parser";
import prisma from "@shared/dbConfig/database.js";
import path from "path";

const EXPECTED_HEADERS = [
    "product_name", "product_code", "description","mrp", "net_price","brand", "qty", "uom", 
    "master_packing_size", "small_packing_size", "product_size", "product_thickness"
];

const MAX_ROWS = 5000; 

export async function downloadProductTemplate(req, res) {
    try {
        const filePath = path.join(process.cwd(),"webs","loyalty", "uploadCSV","templates","product_template.csv");

        const folderPath = path.dirname(filePath);

        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, EXPECTED_HEADERS.join(",") + "\n", "utf-8");
        }

        res.setHeader("Content-Disposition", "attachment; filename=product_template.csv");
        res.setHeader("Content-Type", "text/csv");
        res.sendFile(filePath);
    } catch (err) {
        console.error("Template download error:", err);
        res.status(500).json({ error: "Failed to generate or download template" });
    }
}


export const uploadProductCSV = async (req, res, next) => {
    const filePath = req.file?.path;

    if (!filePath || !filePath.endsWith(".csv")) {
        return res.status(400).json({ error: "Valid CSV file required" });
    }

    const { id, name } = req.user;
    const results = [];
    let rowCount = 0;
    let hasInvalidHeader = false;

  
    const sanitizeCell = (val) => val.replace(/[\n\r\t]/g, " ").trim();
    const clean = (val) => (val === undefined || val === null || val.trim() === "" ? undefined : sanitizeCell(val));

    try {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("headers", (headers) => {
                const missingHeaders = EXPECTED_HEADERS.filter((h) => !headers.includes(h));
                if (missingHeaders.length > 0) {
                    hasInvalidHeader = true;
                    fs.unlinkSync(filePath);
                    return res.status(400).json({
                        error: "Invalid CSV headers",
                        missing: missingHeaders,
                        message: "Please use the provided CSV template."
                    });
                }
            })
            .on("data", (row) => {
                if (hasInvalidHeader) return;

                rowCount++;
                if (rowCount > MAX_ROWS) {
                    throw new Error(`File contains too many rows. Maximum allowed: ${MAX_ROWS}`);
                }

                results.push({
                    product_name: clean(row.product_name),
                    product_code: clean(row.product_code),
                    description: clean(row.description),
                    mrp: clean(row.mrp) ? parseFloat(row.mrp) : null,
                    net_price: clean(row.net_price) ? parseFloat(row.net_price) : null,
                    brand: clean(row.brand),
                    qty: clean(row.qty) ? parseInt(row.qty) : null,
                    uom: clean(row.uom),
                    master_packing_size: clean(row.master_packing_size) ? parseInt(row.master_packing_size) : null,
                    small_packing_size: clean(row.small_packing_size) ? parseInt(row.small_packing_size) : null,
                    product_size: clean(row.product_size),
                    product_thickness: clean(row.product_thickness),
                    created_by_id: id,
                    created_by_name: name,
                    date_created: new Date(),
                });
            })
            .on("end", async () => {
                try {

                    if (results.length === 0) {
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        return res.status(400).json({ error: "CSV file is empty" });
                    }
                      
                   const inserted =  await prisma.master_product.createMany({
                        data: results,
                        skipDuplicates: true,
                    });

                    fs.unlinkSync(filePath);
                  if(inserted.count === 0){
                      return res.status(200).json({
                          message: "Nothing Insert ! May be the Same Data Uploaded!",
                          FileRowCount: results.length,
                          DataInsertCount: inserted.count,
                      });
                  }
                  return  res.status(200).json({
                        message: "Product data uploaded successfully",
                        FileRowCount: results.length,
                         DataInsertCount : inserted.count,
                    });
                } catch (dbErr) {
                    console.error("Database Error:", dbErr);
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    res.status(500).json({ error: "Database insert failed" });
                }
            })
            .on("error", (parseErr) => {
                console.error("CSV Parse Error:", parseErr);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                res.status(500).json({ error: "Failed to parse CSV file" });
            });
    } catch (err) {
        console.error("Processing Error:", err);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ error: "CSV processing failed" });
        next(err);
    }
};
