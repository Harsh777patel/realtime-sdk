import mongoose from "../connection.js";

const mySchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  city: { type: String, default: "unknown" },
  createdAt: { type: Date, default: Date.now },
   phone: String,
  location: String,
  about: String,
  skills: String,
  
});

export default mongoose.model("user", mySchema);
