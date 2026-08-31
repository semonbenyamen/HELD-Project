import { Router } from "express";
import {
  createLead,
  getLeads,
  assignLead,
  updateLeadStatus,
  addLeadNote,
  addFollowUp,
  updateFollowUpStatus
} from "../controllers/leadController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/", createLead);

router.get("/", protect, getLeads);
router.patch("/:id/assign", protect, allowRoles("admin"), assignLead);
router.patch("/:id/status", protect, updateLeadStatus);
router.post("/:id/notes", protect, addLeadNote);
router.post("/:id/follow-ups", protect, addFollowUp);
router.patch("/:id/follow-ups/:followUpId", protect, updateFollowUpStatus);

export default router;
