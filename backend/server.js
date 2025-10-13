
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import psqiRoutes from "./routes/psqi.js";
import diaryRoutes from "./routes/diaryRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ เชื่อม MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB Error:", err));



app.get("/", (req, res) => {
  res.send("Welcome to Good Night Hub 🌙");
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/psqi", psqiRoutes);
app.use("/api/diary", diaryRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
