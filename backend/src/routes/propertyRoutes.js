import { Router } from "express";
import {
  getProperties,
  getFeaturedProperties,
  getPropertyByIdOrSlug,
  createProperty,
  updateProperty,
  deleteProperty
} from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/featured", getFeaturedProperties);
router.get("/", getProperties);
router.get("/:id", getPropertyByIdOrSlug);

router.post("/", protect, allowRoles("admin"), createProperty);
router.put("/:id", protect, allowRoles("admin"), updateProperty);
router.delete("/:id", protect, allowRoles("admin"), deleteProperty);

export default router;
