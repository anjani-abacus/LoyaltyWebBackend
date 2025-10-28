import csv from 'csv-parser';
import https from 'https';
import prisma from '@shared/dbConfig/database.js';

export const uploadPostalCSV = async (req, res) => {
    const csvKey = req.file?.key;
    if (!csvKey) {
        return res.status(400).json({ error: 'CSV file required' });
    }

    // ✅ Build URL manually
    const fileUrl = `${process.env.S3_PUBLIC_URL}/${csvKey}`;

    const results = [];

    try {
        https.get(fileUrl, (response) => {
            response
                .pipe(csv())
                .on('data', (row) => {
                    results.push({
                        id: Number(row.id),
                        state_name: row.state_name,
                        district_name: row.district_name,
                        city: row.city || null,
                        area: row.area || null,
                        pincode: row.pincode ? Number(row.pincode) : null,
                        bonus_flag: Number(row.bonus_flag),
                        del: ['1', 'true', "b'1'"].includes(String(row.del).toLowerCase()),
                        download: Number(row.download),
                        report_district_flag: Number(row.report_district_flag),
                        zones: row.zones,
                    });
                })
                .on('end', async () => {
                    try {
                        await prisma.abq_postal_master.createMany({
                            data: results,
                            skipDuplicates: true,
                            
                        });
                        res.json({ message: 'Postal data uploaded successfully', count: results.length });
                    } catch (dbErr) {
                        console.error('Database Error:', dbErr);
                        res.status(500).json({ error: 'Database insert failed' });
                    }
                })
                .on('error', (err) => {
                    console.error('CSV Stream Error:', err);
                    res.status(500).json({ error: 'CSV parsing failed' });
                });
        }).on('error', (err) => {
            console.error('HTTPS Download Error:', err);
            res.status(500).json({ error: 'Failed to download file from S3' });
        });
    } catch (err) {
        console.error('Processing Error:', err);
        res.status(500).json({ error: 'CSV processing failed' });
    }
};
