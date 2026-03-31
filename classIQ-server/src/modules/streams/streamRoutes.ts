import express from "express";
import * as streamController from "./streamController.js";
import { protect } from "../../middleware/auth.js";

const router = express.Router();

// Create Stream (announcement)
router.post(
  "/classes/:classId/streams",
  protect,
  streamController.createStream
);

// Get Class Streams
router.get(
  "/classes/:classId/streams",
  protect,
  streamController.getClassStreams
);

// Delete Stream
router.delete(
  "/streams/:streamId",
  protect,
  streamController.deleteStream
);

export default router;