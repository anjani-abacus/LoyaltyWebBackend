import Joi from 'joi';

export const influencerCustomerSchema = Joi.object({
  
  created_by_type: Joi.string().valid('SELF', 'SYSTEM').optional().allow(null), 

  influencer_type_name: Joi.string().max(50).required(),

  profile_img: Joi.string().uri().optional().allow(null, ''),
  name: Joi.string().max(250).optional(),
  email: Joi.string().email().max(25).optional(),
  mobile: Joi.string()
    .pattern(/^(\+\d{1,3})?\d{10,12}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base":
        "Mobile must be 10-12 digits, optionally prefixed with country code like +91",
    }),
  country: Joi.string().max(100).optional(),
  state: Joi.string().max(150).optional(),
  district: Joi.string().max(150).optional(),
  city: Joi.string().max(150).optional(),
  area: Joi.string().max(400).optional(),
  pincode: Joi.string().max(10).optional(),

  address: Joi.string().optional(),
  lat: Joi.string().max(50).optional().allow(null, ''),
  lng: Joi.string().max(50).optional().allow(null, ''),

  kyc_document_type: Joi.string().valid('AADHAAR', 'VOTERID', 'DRIVINGLICENSE').optional(),
  document_no: Joi.string().max(20).optional(),
  document_img_front: Joi.string().optional().allow(null, ''),
  document_img_back: Joi.string().optional().allow(null, ''),

  pan_no: Joi.string().max(14).optional(),
  document_pan_img: Joi.string().optional().allow(null, ''),

  user_redeemption_prefrence: Joi.string().valid('UPI', 'BANK').optional(), 
  upi_id: Joi.string().optional().allow(null, ''),
  account_holder_name: Joi.string().max(150).optional().allow(null, ''),
  bank_name: Joi.string().max(150).optional().allow(null, ''),
  ifsc_code: Joi.string().max(30).optional().allow(null, ''),
  account_no: Joi.string().max(30).optional().allow(null, ''),
  document_bank_img: Joi.string().optional().allow(null, ''),

  kyc_status: Joi.string().valid('PENDING', 'APPROVED', 'REJECT').default('PENDING'),
  kyc_remark: Joi.string().optional().allow(null, ''),
  kyc_verified_date: Joi.date().optional().allow(null),
  kyc_verified_by_id: Joi.number().optional().allow(null),
  kyc_verified_by_name: Joi.string().max(100).optional().allow(null, ''),

  work_anniversary_date: Joi.date().optional().allow(null),
  birth_date: Joi.date().optional().allow(null),
  wedding_date: Joi.date().optional().allow(null),
  welcome_bonus_flag: Joi.boolean().optional(),

  last_scan_date: Joi.date().optional().allow(null),

  status_of_profile: Joi.string().valid('PENDING', 'APPROVED', 'REJECT').default('PENDING'), 
  status_change_date: Joi.date().optional().allow(null),
  status_change_by: Joi.number().optional().allow(null),

  active_status: Joi.boolean().optional(),
  active_status_change_by_id: Joi.number().optional().allow(null),
  active_status_changed_date: Joi.date().optional().allow(null),

  referral_code: Joi.string().max(50).optional().allow(null, ''),
  referred_by_id: Joi.number().optional().allow(null),
  referred_by_code: Joi.string().max(50).optional().allow(null, ''),

  current_wallet_balnc: Joi.string().max(100).optional().allow(null, ''),
  last_wallet_update: Joi.date().optional().allow(null),

  dealer_code: Joi.string().max(100).optional().allow(null, ''),
  dealer_id: Joi.number().optional().allow(null),
  dealer_name: Joi.string().max(100).optional().allow(null, ''),
  dealer_mobile: Joi.string().max(12).optional().allow(null, ''),

  distributor_name: Joi.string().max(50).optional().allow(null, ''),

  first_login_timestamp: Joi.date().optional().allow(null),
  last_login_timestamp: Joi.date().optional().allow(null),

  app_version: Joi.string().max(30).optional().allow(null, ''),
  device_unique_id: Joi.string().max(150).optional().allow(null, ''),
  device_info: Joi.string().max(150).optional().allow(null, ''),
  onesignal_token: Joi.string().max(215).optional().allow(null, ''),
  app_language: Joi.string().max(200).optional().allow(null, ''),

  registration_source: Joi.string().max(100).optional().allow(null, ''),
  last_updated_by: Joi.string().max(300).optional().allow(null, ''),
  last_updated_on: Joi.date().optional().allow(null),

  reopned_date: Joi.date().optional().allow(null),
  reopned_by_id: Joi.number().optional().allow(null),

  facebook_id: Joi.string().max(200).optional().allow(null, ''),
  instagram_id: Joi.string().max(200).optional().allow(null, ''),

  del: Joi.boolean().optional()
});
