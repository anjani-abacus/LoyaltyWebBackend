import express from "express";
import {
    createVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
} from "../controllers/tutorialControllers.js"; 
import { authenticateToken } from "@shared/middlewares/authenticateToken.js";

const tutorialRoutes = express.Router();

// Create a new video
tutorialRoutes.post("/create_tutorial", authenticateToken, createVideo);

// Get all videos
tutorialRoutes.get("/get_all_tutorials", getAllVideos);

// Get a single video by ID
tutorialRoutes.get("/get_video_by_id/:id", getVideoById);

// Update a video by ID
tutorialRoutes.put("/update_tutoria/:id", updateVideo);

// Delete a video by ID (soft delete)
tutorialRoutes.delete("/delete_tutorial/:id",  deleteVideo);

export default tutorialRoutes;
