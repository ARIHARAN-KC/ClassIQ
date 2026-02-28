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

const router = Router();


// Create Class
router.post("/", protect, authorize("teacher"), createClass);

// Join Class (via joinCode)
router.post("/join", protect, authorize("student"), joinClass);

// Get All Classes (Dashboard)
router.get("/", protect, getAllClasses);

//Get Single Class
router.get("/:classId", protect, getClassById);

//Update Class
router.put("/:classId", protect, authorize("teacher"), updateClass);

// Delete Class
router.delete("/:classId", protect, authorize("teacher"), deleteClass);

export default router;