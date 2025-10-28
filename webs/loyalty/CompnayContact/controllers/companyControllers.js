import prisma from "@shared/dbConfig/database.js";
import { config } from "@shared/utils/env.js";

export const createCompanyContact = async (req, res,next) => {
  const {
    company_name,
    email,
    address,
    contact_number,
    contact_number_2,
    about_us,
    website_url,
    iframe_url_map,
    facebook_url,
    twitter_url,
    instagram_url,
    linkedin_url
  }=req.body;
  const{id,name}=req.user;
    const profile_img = `${config.s3.publicUrl}/${req.file?.key}`;
  try {

    const newENTRY = await prisma.company_contact_master.create({
      data: {
        created_by:id,
        created_by_name:name,
        company_name,
        email,
        address,
            contact_number,
            contact_number_2,
            about_us,
            ...(profile_img && { profile_img: profile_img ?? profile_img }),
            website_url,
            iframe_url_map,
            facebook_url,
            twitter_url,
            instagram_url,
            linkedin_url
      }})
      return res.status(201).json({status:true,message :"Succesfully Created!",data:newENTRY})
  } catch (error) {
   res.status(500).json({status:false,message:error.message})
    next(error);
  }
}
export const getCompanyContact = async (req, res,next) => {
  try {
    const newENTRY = await prisma.company_contact_master.findMany({
        where:{
            del:false
        }
    })    
    return res.status(200).json({status:true,message :"Succesfully Fetched!",data:newENTRY})
  } catch (error) {
   res.status(500).json({status:false,message:`error.message`})
    next(error);
  }
}

export const updateCompanyContact = async (req, res,next) => {
    const {
        company_name,
        email,
        address,
        contact_number,
        contact_number_2,
        about_us,
        profile_img,
        website_url,
        iframe_url_map,
        facebook_url,
        twitter_url,
        instagram_url,
        linkedin_url
      }=req.body;
      const{id,name}=req.user;
      try {
        const newENTRY = await prisma.company_contact_master.update({
          where:{
            id:Number(req.params.id),
            del:false
          },
          data: {
              last_updated_on:new Date(),
              last_updated_by:id,
              last_updated_by_name:name,
              company_name,
              email,
              address,
                contact_number,
                contact_number_2,
                about_us,
                profile_img,
                website_url,
                iframe_url_map,
                facebook_url,
                twitter_url,
                instagram_url,
                linkedin_url
    }
        })
        return res.status(201).json({status:true,message :"Succesfully Updated!",data:newENTRY})

    }catch (error){
        res.status(500).json({status:false,message:`error.message`})
        next(error)
    }
}

