import { Router } from "express";
import {
  createClass,
  joinClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
} from "./classController.js";

import { protect } from "../../middleware/auth.js";
import { authorize } from "../../middleware/role.js";
import { ROLES } from "../../constants/roles.js";

const router = Router();

router.post("/", protect, authorize(ROLES.TEACHER), createClass);
router.post("/join", protect, authorize(ROLES.STUDENT), joinClass);
router.get("/", protect, getAllClasses);
router.get("/:classId", protect, getClassById);
router.put("/:classId", protect, authorize(ROLES.TEACHER), updateClass);
router.delete("/:classId", protect, authorize(ROLES.TEACHER), deleteClass);

export default router;