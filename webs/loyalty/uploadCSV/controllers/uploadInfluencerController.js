import fs from "fs";
import csv from "csv-parser";
import prisma from "@shared/dbConfig/database.js";
import path from "path";

const EXPECTED_HEADERS = [
    "name", "email", "mobile", "country", "birth_date", "influencer_type_name",
    "referred_by_code", "address", "pincode", "state", "district", "city", "area"
];

const MAX_ROWS = 5000; 



export async function downloadTemplate(req, res) {
    try {
        const filePath = path.join(process.cwd(), "webs", "loyalty", "uploadCSV", "templates", "influencer_template.csv");

        const folderPath = path.dirname(filePath);

        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, EXPECTED_HEADERS.join(",") + "\n", "utf-8");
        }

        res.setHeader("Content-Disposition", "attachment; filename=influencer_template.csv");
        res.setHeader("Content-Type", "text/csv");
        res.sendFile(filePath);
    } catch (err) {
        console.error("Template download error:", err);
        res.status(500).json({ error: "Failed to generate or download template" });
    }
}


export const uploadInfluencerCSV = async (req, res, next) => {
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

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

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

                const email = clean(row.email);
                const mobile = clean(row.mobile);

                results.push({
                    name: clean(row.name),
                    email: email && isValidEmail(email) ? email : undefined,
                    mobile: mobile && isValidMobile(mobile) ? mobile : undefined,
                    country: clean(row.country),
                    birth_date: clean(row.birth_date) ? new Date(clean(row.birth_date)) : null,
                    influencer_type_name: clean(row.influencer_type_name),
                    referred_by_code: clean(row.referred_by_code) || "",
                    address: clean(row.address),
                    pincode: clean(row.pincode),
                    state: clean(row.state),
                    district: clean(row.district),
                    city: clean(row.city),
                    area: clean(row.area),
                    login_type: "Loyalty",
                    referral_code: `REF${Math.floor(100000 + Math.random() * 900000)}`,
                    created_by_id: id,
                    created_by_name: name,
                    date_created: new Date(),
                });
            })
            .on("end", async () => {
                try {
                    const sanitizedData = results.filter((r) => r.mobile && r.name);

                    if (sanitizedData.length === 0) {
                        fs.unlinkSync(filePath);
                        return res.status(400).json({ error: "No valid influencer data found in CSV" });
                    }

                    await prisma.influencer_customer.createMany({
                        data: sanitizedData,
                        skipDuplicates: true,
                    });

                    fs.unlinkSync(filePath);

                    res.status(200).json({
                        message: "Influencer data uploaded successfully",
                        count: sanitizedData.length,
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
