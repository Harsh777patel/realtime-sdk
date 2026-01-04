import crypto from "crypto";
import bcrypt from "bcrypt";
import ApiKey from "../models/ApiKey.js";

/**
 * CREATE (Generate) NEW API KEY
 * POST /api-keys
 */
export const createApiKey = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;
    const email = req.user.email;
    console.log(req.user);
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "API key name is required",
      });
    }

    // Generate secure random API key
    const apiKey = "sk_" + crypto.randomBytes(32).toString("hex");

    const newKey = new ApiKey({
      name: name.trim(),
      apiKey, // (later can be hashed)
      userId,
      isActive: true,
      createdAt: new Date(),
      lastUsedAt: null,
    });

    await newKey.save();

    // Show API key ONLY once
    res.status(201).json({
      success: true,
      data: {
        _id: newKey._id,
        name: newKey.name,
        apiKey,
        createdAt: newKey.createdAt,
      },
      message: "✅ API key created! Save it now.",
    });
  } catch (error) {
    console.error("Error creating API key:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create API key",
    });
  }
};

/**
 * GET ALL API KEYS (without secret)
 * GET /api-keys
 */
export const getApiKeys = async (req, res) => {
  try {
    const userId = req.user.id;

    const keys = await ApiKey.find({ userId });

    res.status(200).json({
      success: true,
      data: keys,
    });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch API keys",
    });
  }
};

/**
 * DELETE API KEY
 * DELETE /api-keys/:id
 */
export const deleteApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const key = await ApiKey.findOneAndDelete({ _id: id, userId });

    if (!key) {
      return res.status(404).json({
        success: false,
        message: "API key not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ API key deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting key:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete API key",
    });
  }
};

/**
 * VALIDATE API KEY (Public)
 * POST /api-keys/validate-key
 */
export const validateApiKey = async (apiKey) => {
  try {
    // Ensure apiKey is a string
    if (!apiKey || typeof apiKey !== 'string') {
      console.error("API key must be a string, received:", typeof apiKey);
      return false;
    }

    // Query database - match the field name in your schema
    const key = await ApiKey.findOne({ apiKey });
    
    if (key) {
      console.log("✅ API key validated successfully");
      return true;
    }
    
    console.warn("❌ API key not found in database");
    return false;
  } catch (err) {
    console.error("Error validating key:", err.message);
    return false;
  }
};

/**
 * VALIDATE API KEY - HTTP Endpoint
 * POST /api-keys/validate
 */
export const validateApiKeyEndpoint = async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.body.apiKey;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: "API key is required",
      });
    }

    const isValid = await validateApiKey(apiKey);

    res.status(isValid ? 200 : 401).json({
      success: isValid,
      message: isValid ? "✅ API key is valid" : "❌ API key is invalid",
    });
  } catch (error) {
    console.error("Error validating API key:", error);
    res.status(500).json({
      success: false,
      message: "Failed to validate API key",
    });
  }
};
