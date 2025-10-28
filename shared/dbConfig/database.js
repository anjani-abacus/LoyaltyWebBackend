import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

import {AsyncLocalStorage} from 'node:async_hooks';
const asyncLocalStorage = new AsyncLocalStorage();

export const setUserContext = (req, res, next) => {
    const user = req.user || { id: 1, name: "SYSTEM" };
    const ip = req.ip || req.headers["x-forwarded-for"] || null;

    const store = { currentUser: user, ip };

    asyncLocalStorage.run(store, () => {
        next();
    });
};
const IGNORED_TABLES = ["audit_log", "_prisma_migrations"];

const getDiff = (oldObj = {}, newObj = {}) => {
    const diff = {};
   
        for (const key in newObj) {
            if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
                diff[key] = { from: oldObj[key], to: newObj[key] };
            }
        }
    
    return diff;
};
const generateRemark = ({ model, operation, oldData, newData }) => {
    if (operation === "CREATE") return `${model} record created`;
    if (operation === "DELETE") return `${model} record deleted`;
    if (operation === "UPDATE") {
        const changedFields = Object.keys(getDiff(oldData, newData) || {});
        if (changedFields.length > 0) {
            return `${model} updated fields: ${changedFields.join(", ")}.`;
        }
        return `${model} update operation occurred with no changes.`;
    }

    if (operation === "UPSERT") {
        return oldData
            ? `${model} record updated via upsert.`
            : `${model} record created via upsert.`;
    }

    return `${model} ${operation.toLowerCase()} operation performed.`;
};

const prisma = new PrismaClient().$extends({
    // Extend queries for logging
    query: {
        $allModels: {
            async $allOperations({ model, operation, args, query }) {
                const start = Date.now();
                const result = await query(args);
                const end = Date.now();

                logger.info(`[${model}.${operation}] took ${end - start}ms`);

                const writeOps = [
                    "create",
                    "update",
                    "delete",
                    "upsert",
                    "createMany",
                    "deleteMany",
                    
                ];
                if (!writeOps.includes(operation) || IGNORED_TABLES.includes(model)) {
                    return result;
                }

                // Get request context
                const store = asyncLocalStorage.getStore();
                const currentUser = store?.currentUser;
                const ip = store?.ip;

                (async () => {
                    try {
                        let oldRecord = null;
                        if (["update", "delete", "upsert"].includes(operation) && args?.where) {
                            try {
                                oldRecord = await prisma[model].findUnique({ where: args.where });
                            } catch { }
                        }

                        const logData = {
                            table_name: model,
                            record_id: result?.id || args?.where?.id || null,
                            operation: operation.toUpperCase(),
                            old_data: oldRecord || null,
                            new_data: result || null,
                            changed_by_id: currentUser?.id || null,
                            changed_by_name: currentUser?.name || null,
                            ip_address: ip || null,
                            remark: generateRemark({
                                model,
                                operation: operation.toUpperCase(),
                                oldData: oldRecord,
                                newData: result,
                            }),
                        };

                        if (model !== "audit_log") {
                            await prisma.audit_log.create({ data: logData });
                        }

                        // const isolatedPrisma = new PrismaClient();
                        // await isolatedPrisma.audit_log.create({ data: logData });
                        // await isolatedPrisma.$disconnect();
                    }catch(err){
                        logger.error(`[Audit] Failed for ${model}:${operation} - ${err.message}`);
                    }
                })();

                return result;
                    },
            
    model: {
        sfa_user: {
            async $allOperations({ operation, args, query }) {
                if (!args.select) {
                    args.select = { password: false }; 
                } else if ('password' in args.select) {
                    args.select.password = false; 
                }
                return query(args);
            },
        },
    },
},
},
});

const start = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Database connected and Prisma client is running.');
        process.stdin.resume();
    } catch (error) {
        console.error('❌ Failed to connect to the database:', error);
        process.exit(1);
    }
};

start();

export default prisma;
