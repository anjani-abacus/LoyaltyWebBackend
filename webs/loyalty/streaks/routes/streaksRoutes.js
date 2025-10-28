import express from "express";
import { getStreak } from "../controllers/streaksControllers.js";

const streakRouter = express.Router();

streakRouter.post('/get_streak',getStreak)

export default streakRouter;

