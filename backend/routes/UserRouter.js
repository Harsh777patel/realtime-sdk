import express from "express";
import User from "../models/UserModel.js";

import { registerUser, loginUser, getAllUsers, getUserCount, deleteUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", getAllUsers);
router.get("/count", getUserCount);
router.delete("/:id", deleteUser);

router.get("/getbyid", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET profile
// router.get("/profile", async (req, res) => {
//   const user = await User.findOne(); // demo
//   res.json(user);
// });

// UPDATE profile
router.put("/update", verifyToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});


export default router;
