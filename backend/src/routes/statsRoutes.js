import { Router } from "express";
import { getStats } from "../controllers/statsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getStats);

export default router;
