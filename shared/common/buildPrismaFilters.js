const buildPrismaFilters = (filters = {}, fieldTypes = {}) => {
    const where = { del: false };
    console.log("Initial where object:", where);

    // Handle start_date / end_date range filter
    if (filters.start_date && filters.end_date) {
        where.start_date = { lte: new Date(filters.end_date) };
        where.end_date = { gte: new Date(filters.start_date) };
        console.log("Applied start/end range filter:", {
            start_date: where.start_date,
            end_date: where.end_date,
        });
    }

    // Iterate over each filter field
    for (const [field, value] of Object.entries(filters)) {
        if (value === undefined || value === null || value === "") {
            console.log(`Skipping empty filter: ${field}`);
            continue;
        }

        if (field === "start_date" || field === "end_date") {
            console.log(`Skipping ${field} (already handled as range)`);
            continue;
        }

        const fieldType = fieldTypes[field] || "exact";
        console.log(`Processing field: ${field}, value: ${value}, type: ${fieldType}`);

        switch (fieldType) {
            case "string":
                where[field] = { contains: String(value) };
                console.log(`Applied string filter for ${field}:`, where[field]);
                break;

            case "boolean":
                where[field] = { equals: value === true || value === "true" };
                console.log(`Applied boolean filter for ${field}:`, where[field]);
                break;

            case "number":
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                    where[field] = { equals: numValue };
                    console.log(`Applied number filter for ${field}:`, where[field]);
                }
                break;

            case "date":
                try {
                    const start = new Date(value);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(value);
                    end.setHours(23, 59, 59, 999);
                    where[field] = { gte: start, lte: end };
                    console.log(`Applied single-day date filter for ${field}:`, where[field]);
                } catch {
                    console.log(`Invalid date for field ${field}: ${value}`);
                }
                break;

            case "in":
                if (Array.isArray(value)) {
                    where[field] = { in: value };
                    console.log(`Applied 'in' filter for ${field}:`, where[field]);
                }
                break;

            default:
                where[field] = { equals: value };
                console.log(`Applied exact match filter for ${field}:`, where[field]);
        }
    }

    console.log("Final where object returned:", where);
    return where;
};

export default buildPrismaFilters;