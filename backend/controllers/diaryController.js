import mongoose from "mongoose";
import Diary from "../models/Diary.js";

export const addDiary = async (req, res) => {
  try {
    const { userId, ...rest } = req.body;

    // ✅ เช็กก่อนว่ามี userId ไหม
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "userId ไม่ถูกต้องหรือไม่มี" });
    }

    console.log("📦 Payload:", req.body);
    console.log("✅ typeof userId:", typeof userId);

    const diary = new Diary({
      ...rest,
      userId: new mongoose.Types.ObjectId(userId),
    });

    await diary.save();

    res.status(201).json({ message: "เพิ่มบันทึกการนอนสำเร็จ", diary });

  } catch (err) {
    console.error("❌ Error saving diary:", err.message);
    console.error("🧨 Full error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึก", error: err.message });
  }
};
