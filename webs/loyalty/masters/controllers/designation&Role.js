import prisma from "@shared/dbConfig/database.js";
import buildPrismaFilters from "../../../../shared/common/buildPrismaFilters.js";

const parseFlag = (val) => {
    if (val === 'true' || val === 1 || val === true || val === '1') return 1;
    if (val === 'false' || val === 0 || val === false || val === '0') return 0;
    return 'disable';
};
export const upsertDesignationRole = async (req, res, next) => {
    const { id } = req.params;
    const {
        module_id,
        module_name,
        add,
        view,
        edit,
        delete: del,
        import: imp,
        export: exp,
        approval
    } = req.body;
    try {
      

        const accessFields = {
            add: parseFlag(add),
            view: parseFlag(view),
            edit: parseFlag(edit),
            delete: parseFlag(del),
            import: parseFlag(imp),
            export: parseFlag(exp),
            approval: parseFlag(approval),
            created_by_id:req.user.id,
            created_by_name: req.user.name
        };

        const upserted = await prisma.assign_designation_module.upsert({
            where: {
                module_id_sfa_designation_id: {
                    module_id: Number(module_id),
                    sfa_designation_id: Number(id),
                }
            },
            update: {
                ...accessFields,
                module_name,
                last_updated: new Date(),
                created_by_id: req.user.id,
                created_by_name: req.user.name
            },
            create: {
                module_id: Number(module_id),
                sfa_designation_id: Number(id),
                module_name,
                date_created: new Date(),
                last_updated: new Date(),
                ...accessFields,
                created_by_id: req.user.id,
                created_by_name: req.user.name
            }
        });

        return res.status(200).json({ success: true, message: 'Upserted Successfully', data: upserted });
    } catch (error) {
        next(error);
    }
};


export const getAllAssignDesignationModule = async (req, res, next) => {
    const { page = 1, limit = 20 ,...filters} = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    try {
        const fieldTypes = {
            module_name: "string",
            designation_name: "string",
            date_created: "date"
        };

        const where = buildPrismaFilters(filters, fieldTypes);
        const assignedModules = await prisma.assign_designation_module.findMany({
            where,
            orderBy: { date_created: 'desc' },
            skip,
            take,
          
        });

        res.status(200).json({ data: assignedModules });
    } catch (err) {
        next(err);
    }
};