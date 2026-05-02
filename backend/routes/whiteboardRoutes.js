import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/auth.js";
import {
  saveWhiteboard,
  getUserWhiteboards,
  getWhiteboardById,
  deleteWhiteboard
} from "../controllers/whiteboardController.js";

router.post("/save", verifyToken, saveWhiteboard);
router.get("/list", verifyToken, getUserWhiteboards);
router.get("/:id", verifyToken, getWhiteboardById);
router.delete("/:id", verifyToken, deleteWhiteboard);

export default router;
