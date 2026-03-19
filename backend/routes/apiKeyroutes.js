import express from "express";
import {
  createApiKey,
  getApiKeys,
  deleteApiKey,
  validateApiKey,
} from "../controllers/apikeycontroller.js";
import { apikeyAuth } from "../middleware/apikeyAuth.js";

const router = express.Router();

// Authenticated user routes
router.post("/", apikeyAuth, createApiKey);
router.get("/", apikeyAuth, getApiKeys);
router.delete("/:id", apikeyAuth, deleteApiKey);

// Public API validation
router.post("/validate-key", validateApiKey);

export default router;
