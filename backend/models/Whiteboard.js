import mongoose from "mongoose";

const WhiteboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    default: "Untitled Whiteboard"
  },
  data: {
    type: Array, // Array of pages, each page is an array of strokes
    required: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("Whiteboard", WhiteboardSchema);
