import express from 'express';
import { getAllredeemRequest, getRedeemRequestById, updateRedeemRequest } from '../controllers/redeemRequestController.js';
const redeemRouter=express.Router();

redeemRouter.post('/getAll_redeem_request',getAllredeemRequest);
redeemRouter.get('/get_redeem_request/:id', getRedeemRequestById);
redeemRouter.put('/update_redeem_request/:id',updateRedeemRequest)
export default redeemRouter;