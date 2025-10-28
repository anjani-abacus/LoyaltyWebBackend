import express from "express";
import { createCompanyContact, getCompanyContact, updateCompanyContact } from "../controllers/companyControllers.js";
import { authenticateToken } from "@shared/middlewares/authenticateToken.js";
import upload from "@shared/middlewares/multerS3.js";
import { setUserContext } from "@shared/dbConfig/database.js";

const companyRoutes = express.Router();

companyRoutes.post('/create_company_contact',upload.single('profile_img'),authenticateToken,setUserContext,createCompanyContact)
companyRoutes.get('/get_company_contact',getCompanyContact)
companyRoutes.put('/update_company_contact/:id',authenticateToken,setUserContext,updateCompanyContact)

export default companyRoutes;