import express from "express";
import { getPlatformStats, getAllApiKeys } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Only specific admin can access these stats
const verifyAdmin = (req, res, next) => {
  if (req.user.email === "harsh4004@gmail.com") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admin access only" });
  }
};

router.get("/stats", verifyToken, verifyAdmin, getPlatformStats);
router.get("/keys", verifyToken, verifyAdmin, getAllApiKeys);

export default router;
