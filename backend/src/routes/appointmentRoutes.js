import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/", createAppointment);
router.get("/", protect, allowRoles("admin"), getAppointments);
router.patch("/:id/status", protect, allowRoles("admin"), updateAppointmentStatus);

export default router;
