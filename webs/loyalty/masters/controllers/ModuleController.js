import softDelete from "@shared/common/softDelete.js";
import prisma from "@shared/dbConfig/database.js";


const parseFlag = (val) => {
    if (val === 'true' || val === 1 || val === true || val === '1') return true;
    if (val === 'false' || val === 0 || val === false || val === '0') return false;
    return false; 
};



 export const createModule = async (req, res, next) => {
    try {
        const { id, name } = req.user;
        const { module_name, 
            department_name, 
            add,
            view,
            edit,
            delete: del,
            import: imp,
            export: exp,
            approval
         } = req.body;
        const accessFields = {
            add: parseFlag(add),
            view: parseFlag(view),
            edit: parseFlag(edit),
            delete: parseFlag(del),
            import: parseFlag(imp),
            export: parseFlag(exp),
            approval: parseFlag(approval)
        };
        const existingModule = await prisma.module_master.findFirst({
            where: {
                module_name: module_name,
                department_name: department_name,
                created_by_id: id ,
                created_by_name: name
            },
        });

        if (existingModule) {
            return res.status(409).json({
                success: false,
                message: "Module already exists in this department",
                data: null,
            });
        }

        const newModule = await prisma.module_master.create({
            data: { module_name,
                 department_name,
              ...accessFields,
                  created_by_id:id, 
                  created_by_name:name },
        },      
    );

        res.status(201).json({
            success: true,
            message: "Module created successfully",
            data: newModule,
        });
    } catch (err) {
        next(err);
    }
};
export const updateModule = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { module_name, department_name } = req.body;

        const updatedModule = await prisma.module_master.update({
            where: { id: Number(id) },
            data: { module_name, department_name },
        });
        res.status(200).json({ message: 'Module Master updated successfully', data: updatedModule });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    const { page = 1, limit = 20, filters={} } = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    try {
        const modulesCount = await prisma.module_master.count();
        const modules = await prisma.module_master.findMany(
            { where: { ...filters, del: false },
            skip,
            take,
        });
        res.status(200).json({message:'Successfully Fetched',count:modulesCount, data: modules });
    } catch (err) {
        next(err);
    }
};

export const softDeleteModule = async (req, res, next) => {
    try {
        const { id } = req.params;
        await softDelete('module_master', 'id', Number(id));
        res.status(200).json({ message: 'Module Master deleted successfully' });
    } catch (error) {
        next(error);
    }
}

export const createRole= async (req, res, next) => {
    try {
        const { id, name } = req.user;
        const { role_name ,  user_type} = req.body;

        const upsert = await prisma.roles.create({
            data: { role_name,
                 user_type,
                  created_at: new Date(),
                    created_by_id: id,
                     created_by_name: name },
                     
        },
    );
        res.status(200).json({ message: 'Designation and Role created/updated successfully', data: upsert });
    } catch (error) {
        next(error);
    }
}

export const getAllRole = async (req, res, next) => {
    const { page = 1, limit = 20, filters={} } = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    try {
        const [rolesCount, roles] = await Promise.all([
         prisma.roles.count(),
           prisma.roles.findMany({
            where: {...filters, del: false },
            skip,
            take,
            orderBy: { id: 'desc' }
        })
    ]);
        res.status(200).json({message:"Successfully Fetched!",count:rolesCount, data: roles });
    } catch (err) {
        next(err);
    }   
};
export const updateRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role_name, user_type } = req.body;
        const updatedRole = await prisma.roles.update({
            where: { id: Number(id) },
            data: { role_name, user_type },
        });
        res.status(200).json({ message: 'Designation and Role updated successfully', data: updatedRole });
    } catch (error) {
        next(error);
    }
};

export const softDeleteRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        await softDelete('roles', 'id', Number(id));
        res.status(200).json({ message: 'Designation and Role deleted successfully' });
    } catch (error) {
        next(error);
    }
};
// PUT /designation/update-role
export const assignDesignationModule = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            module_id,
            module_name,
            designation_name,
            add,
            view,
            edit,
            delete: del,
            import: imp,
            export: exp,
            approval
        } = req.body;
        const accessFields = {
            add: parseFlag(add),
            view: parseFlag(view),
            edit: parseFlag(edit),
            delete: parseFlag(del),
            import: parseFlag(imp),
            export: parseFlag(exp),
            approval: parseFlag(approval)
        };

        const existing = await prisma.assign_designation_module.findFirst({
            where: {
                module_id: Number(module_id),
                designation_id: Number(id),
                designation_name
            }
        });

       if (existing) {
            return res.status(409).json({
                success: false,
                message: "This module is already assigned to this designation",
                data: null,
            });
        }
            await prisma.assign_designation_module.create({
                data: {
                    module_id: Number(module_id),
                    module_name,
                    designation_id: Number(id),
                    designation_name,
                    date_created: new Date(),
                    ...accessFields,
                    created_by_id:req.user.id,
                    created_by_name:req.user.name
                }            },
            );
        


        return res.status(200).json({ message: 'Updated Successfully', data: existing || null });
    } catch (error) {
        next(error);
    }
};
export const getModuleByDesignationId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = await prisma.assign_designation_module.findMany({
            where: {
                designation_id: Number(id),
                del: false
            },
            include: {
                module_master: true
            }
        });
        return res.status(200).json({ message: 'Fetched Successfully', data: existing });
    } catch (error) {
        next(error);
    }
};

export const getAllAssignDesignationModule = async (req, res, next) => {
    const { page = 1, limit = 20, filters = {} } = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    try {
        const assignedModulesCount = await prisma.assign_designation_module.count();
        const assignedModules = await prisma.assign_designation_module.findMany({
            where: { ...filters, del: false},
            skip,
            take,
            orderBy: { date_created: 'asc' },
            include: {
                module_master: true
                }
        });

        res.status(200).json({message:"Successfully Fetched!",count:assignedModulesCount, data: assignedModules });
    } catch (err) {
        next(err);
    }
};
