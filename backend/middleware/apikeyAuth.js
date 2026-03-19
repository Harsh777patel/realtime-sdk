// middleware/apiKeyAuth.js
import bcrypt from "bcrypt";
import ApiKey from "../models/ApiKey.js";
import jwt from "jsonwebtoken";

export const apiKeyAuth = async (req, res, next) => {
  const key = req.headers["x-api-key"];
  if (!key) return res.status(401).json({ message: "API key required" });

  const keys = await ApiKey.find({ isActive: true });

  for (let k of keys) {
    if (await bcrypt.compare(key, k.apiKeyHash)) {
      k.lastUsedAt = new Date();
      await k.save();
      return next();
    }
  }

  res.status(403).json({ message: "Invalid API key" });
};

export const apikeyAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
