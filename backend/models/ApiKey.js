import mongoose from "mongoose";

const apikeySchema = new mongoose.Schema(
  {
    // User details
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Descriptive name
    name: {
      type: String,
      required: true,
    },

    // API Key (HASHED or Raw for now)
    apiKey: {
      type: String,
      required: true,
      unique: true,
    },

    // Security
    isActive: {
      type: Boolean,
      default: true,
    },

    lastUsedAt: {
      type: Date,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ApiKey", apikeySchema);
