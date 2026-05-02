import Whiteboard from "../models/Whiteboard.js";

export const saveWhiteboard = async (req, res) => {
  try {
    const { id, name, data } = req.body;
    const userId = req.user.id;

    let whiteboard;
    if (id) {
      whiteboard = await Whiteboard.findOneAndUpdate(
        { _id: id, userId },
        { name, data, lastModified: Date.now() },
        { new: true }
      );
    }

    if (!whiteboard) {
      whiteboard = new Whiteboard({
        userId,
        name: name || "Untitled Whiteboard",
        data
      });
      await whiteboard.save();
    }

    res.status(200).json({ success: true, whiteboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserWhiteboards = async (req, res) => {
  try {
    const whiteboards = await Whiteboard.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, whiteboards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWhiteboardById = async (req, res) => {
  try {
    const whiteboard = await Whiteboard.findOne({ _id: req.params.id, userId: req.user.id });
    if (!whiteboard) return res.status(404).json({ success: false, message: "Whiteboard not found" });
    res.status(200).json({ success: true, whiteboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteWhiteboard = async (req, res) => {
  try {
    const result = await Whiteboard.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) return res.status(404).json({ success: false, message: "Whiteboard not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
