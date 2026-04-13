import express from "express";
import {
  createApiKey,
  getApiKeys,
  deleteApiKey,
  validateKeyController,
} from "../controllers/apikeycontroller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Authenticated user routes
router.post("/", verifyToken, createApiKey);
router.get("/", verifyToken, getApiKeys);
router.delete("/:id", verifyToken, deleteApiKey);

// Public API validation
router.post("/validate-key", validateKeyController);

export default router;
