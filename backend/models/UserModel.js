import mongoose from "mongoose";

const mySchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  city: { type: String, default: "unknown" },
  createdAt: { type: Date, default: Date.now },
  phone: String,
  location: String,
  about: String,
  skills: String,

});

export default mongoose.model("User", mySchema);
