import { Router } from "express";
import {
  getAgents,
  createAgent,
  updateAgent
} from "../controllers/agentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(protect, allowRoles("admin"));

router.get("/", getAgents);
router.post("/", createAgent);
router.patch("/:id", updateAgent);

export default router;
