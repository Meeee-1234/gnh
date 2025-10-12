// seedAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await User.findOne({ email: "admin@gnh.com" });
    if (existing) {
      console.log("⚠️ Admin already exists");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = new User({
      name: "Admin",
      email: "admin@gnh.com",
      password: hashedPassword,
      role: "admin", // 👈 สำคัญ
    });

    await adminUser.save();
    console.log("✅ Admin user created!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();
