
import express from "express";
import { getLeaderBoardByDistrict, getLeaderBoardByState } from "../controllers/leaderboardcontrollers.js";

const leaderboardRouter = express.Router();

leaderboardRouter.post('/leaderboard_districtwise', getLeaderBoardByDistrict);
leaderboardRouter.post('/leaderboard_statewise', getLeaderBoardByState);

export default leaderboardRouter;

