import express from 'express';
import { addCurrentWalletBal, createUser, deleteUser, getAllScannedCouponById, getAllUsers, getLedgerBalanceInfluencer, getUserById, updateUser } from '../controllers/userController.js';
import { assignDesignationModule,   createModule, createRole, getAll, getAllAssignDesignationModule,  getAllRole, getModuleByDesignationId, softDeleteModule, softDeleteRole, updateModule, updateRole} from '../controllers/ModuleController.js';

import { validateBody } from '@shared/common/validateBody.js';
import { createpointCatgeory, deletePointCategory, deleteProduct, getAllPointCategory, getAllProducts, updatePointCategory, updateProductStatus, upsertProduct } from '../controllers/productController.js';
import {createPointMaster, getALLPointMaster, softDeletePointMaster, updatePointMaster } from '../controllers/pointMasterController.js';
import { validateParam } from '@shared/common/validateParam.js';
import { idParamSchema } from '@shared/common/idParamSchema.js';
import { pointMasterUpsertSchema } from '../joiValidators/pointMasterValidator.js';
import { deletePdf, generatePdf, getAllPdfs } from '../controllers/pdfController.js';
import { createModuleSchema } from '../joiValidators/moduleValidator.js';
import { validateCreateCategorySchema, validateCreateSubCategorySchema } from '../joiValidators/categoryValidator.js';
import { createCategory, createSUBCategory, deleteCategory, deletesubCategory, getAllCategory, getAllSUBCategory, updateCategory, updatestatusofcategory, updatestatusofsubcategory, updateSubCategory } from '../controllers/categoryController.js';
import { documentCatalogueSchema} from '../joiValidators/pdfValidator.js';
import { authenticateToken } from '@shared/middlewares/authenticateToken.js';
import upload from '@shared/middlewares/multerS3.js';
import { ProductValidationSchema } from '../joiValidators/validateProduct.js';
import { setUserContext } from "@shared/dbConfig/database.js";

const masterRoute = express.Router();

// user
masterRoute.post('/create_user', createUser);
masterRoute.post('/get_all_sfa_user',  getAllUsers);
masterRoute.get('/get_user_by_id/:id',  getUserById);
masterRoute.get('/get_user_ledger_balance/:id', validateParam(idParamSchema), getLedgerBalanceInfluencer );
masterRoute.put('/add_current_wallet_balance/:id', validateParam(idParamSchema), addCurrentWalletBal);
masterRoute.get('/get_scanned_coupon_by_id/:id', validateParam(idParamSchema), getAllScannedCouponById)
masterRoute.delete('/delete_user/:id', validateParam(idParamSchema),  deleteUser);
masterRoute.put('/update_user/:id', validateParam(idParamSchema),  updateUser);


// module Master / Designation And Role
masterRoute.post('/create_module',  validateBody(createModuleSchema),authenticateToken,setUserContext, createModule);
masterRoute.put('/update_module/:id', validateParam(idParamSchema), updateModule);
masterRoute.post('/get_aLL_module',  getAll);
masterRoute.delete('/delete_module/:id', validateParam(idParamSchema), softDeleteModule);
masterRoute.post('/create_role',     authenticateToken,    createRole);  
masterRoute.put('/update_role/:id', validateParam(idParamSchema), updateRole);
masterRoute.delete('/delete_role/:id', validateParam(idParamSchema), softDeleteRole);
masterRoute.post('/get_all_role', getAllRole);    
masterRoute.put('/assign_role_module/:id',validateParam(idParamSchema), authenticateToken, assignDesignationModule);
masterRoute.post('/get_module_by_designation_id/:id', validateParam(idParamSchema), getModuleByDesignationId);
masterRoute.post('/get_all_assign_designation_module', getAllAssignDesignationModule);

//referral Point Master
masterRoute.post('/create_point_master', validateBody(pointMasterUpsertSchema), authenticateToken,createPointMaster);
masterRoute.post('/getAll_pointmaster', getALLPointMaster);
masterRoute.delete('/delete_point_master/:id', validateParam(idParamSchema), softDeletePointMaster);
 masterRoute.put('/update_point_master/:id', validateParam(idParamSchema),authenticateToken,setUserContext,updatePointMaster);   



// pdf Module
masterRoute.post('/upload_pdf',  upload.single('doc'), validateBody(documentCatalogueSchema),authenticateToken,setUserContext,generatePdf)
masterRoute.post('/get_all_pdfs',  getAllPdfs);
masterRoute.delete('/delete_pdf/:id', validateParam(idParamSchema),  deletePdf)



// Categories
masterRoute.post('/create_cat', validateBody(validateCreateCategorySchema), authenticateToken,createCategory);
masterRoute.post('/getALL_cat',  getAllCategory);
masterRoute.delete('/category/:id', validateParam(idParamSchema), deleteCategory);
masterRoute.put('/update_category/:id', validateParam(idParamSchema),authenticateToken,setUserContext, updateCategory);
masterRoute.put('/update_category_status/:id', validateParam(idParamSchema),authenticateToken,setUserContext, updatestatusofcategory);

// SUB-Categories
masterRoute.post('/create_sub_cat', validateBody(validateCreateSubCategorySchema), authenticateToken,createSUBCategory);
masterRoute.post('/getAll_sub_cat', getAllSUBCategory);
masterRoute.delete('/delete_sub_category/:id', validateParam(idParamSchema),  deletesubCategory);
masterRoute.put('/update_sub_category/:id', validateParam(idParamSchema),authenticateToken,setUserContext,updateSubCategory);
masterRoute.put('/update_sub_category_status/:id', validateParam(idParamSchema),authenticateToken,setUserContext, updatestatusofsubcategory);

//  Point Category
masterRoute.post('/create_point_category',authenticateToken,setUserContext,createpointCatgeory)
masterRoute.post('/getAll_point_category',getAllPointCategory)
masterRoute.put('/update_point_category/:id',authenticateToken,setUserContext,updatePointCategory)
masterRoute.delete('/delete_point_category/:id',authenticateToken,setUserContext,deletePointCategory)


// Product Module
masterRoute.post('/create_product', upload.single('image'),authenticateToken,setUserContext,  validateBody(ProductValidationSchema),
 upsertProduct);
masterRoute.post('/getAll_product', getAllProducts);
masterRoute.delete('/delete_product/:id', validateParam(idParamSchema), deleteProduct);
masterRoute.put('/update_product_status/:id', validateParam(idParamSchema), authenticateToken,updateProductStatus);
export default masterRoute;