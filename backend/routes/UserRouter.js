import express from "express";
import User from "../models/UserModel.js";

import { registerUser, loginUser, getAllUsers, getUserCount, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", getAllUsers);
router.get("/count", getUserCount);
router.delete("/:id", deleteUser);


// GET profile
router.get("/profile", async (req, res) => {
  const user = await User.findOne(); // demo
  res.json(user);
});

// UPDATE profile
router.put("/profile", async (req, res) => {
  const user = await User.findOneAndUpdate({}, req.body, { new: true, upsert: true });
  res.json(user);
});


export default router;
