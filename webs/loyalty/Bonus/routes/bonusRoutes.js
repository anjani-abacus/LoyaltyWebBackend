import express from "express";
import { createBadge, enrollInfluencerBadge, getAllBadges, softDeleteinfluencerbadges, updateBadge } from "../controllers/badges.js";
import { createBonusPoints, getBonusPoints, getdistrictofstate, getDistrictsByStateRedis, getstate, getStatesByRedis, softDeleteBonusPoints, updateBonusPointsStatus } from "../controllers/bonusPoints.js";
import { createSpinWin, enrollInfluencerSpinWin, getSpinWin, softDeleteSpinWin, updateSpinWinStatus } from "../controllers/spin&win.js";
import upload from "@shared/middlewares/multerS3.js";
import { authenticateToken } from "@shared/middlewares/authenticateToken.js";
import { setUserContext } from "@shared/dbConfig/database.js";
const bonusRouter = express.Router();

// badges
bonusRouter.post('/create_badge',upload.single('image'),authenticateToken,setUserContext,createBadge);
bonusRouter.put('/update_badge/:id',authenticateToken,setUserContext,updateBadge);
bonusRouter.post('/get_all_badges',getAllBadges);
bonusRouter.delete('/delete_badge/:id',softDeleteinfluencerbadges);
bonusRouter.put('/enroll_influencer_badge/:id',enrollInfluencerBadge);

// bonus points
bonusRouter.get('/get_all_states',getstate);
bonusRouter.post('/get_all_districts',getdistrictofstate);

bonusRouter.get('/get_all_states_redis', getStatesByRedis);
bonusRouter.post('/get_all_districts_redis', getDistrictsByStateRedis);

bonusRouter.post('/create_bonus_points',authenticateToken,setUserContext,createBonusPoints);
bonusRouter.post('/get_all_bonus_points',getBonusPoints);
bonusRouter.delete('/delete_bonus_points/:id',softDeleteBonusPoints);
bonusRouter.put('/update_bonus_points_status/:id', authenticateToken,updateBonusPointsStatus);

// spin & win
bonusRouter.post('/create_spin_win',authenticateToken,setUserContext,createSpinWin);
bonusRouter.post('/get_all_spin_win',getSpinWin);
bonusRouter.delete('/delete_spin_win/:id',softDeleteSpinWin);
bonusRouter.put('/enroll_influencer_spin_win/:id',authenticateToken,setUserContext,enrollInfluencerSpinWin);
bonusRouter.put('/update_spin_win_status/:id',authenticateToken,setUserContext,updateSpinWinStatus);
export default bonusRouter;