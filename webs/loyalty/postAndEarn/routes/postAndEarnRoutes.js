import express from "express";
import { getPostAndEarn } from "../controllers/postAndEarnController.js";
const postAndEarnRouter = express.Router();

postAndEarnRouter.post('/get_post_and_earn',getPostAndEarn)

export default postAndEarnRouter;

