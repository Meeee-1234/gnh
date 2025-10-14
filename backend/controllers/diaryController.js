import mongoose from "mongoose";

import Diary from "../models/Diary.js";

// ✅ POST /api/diary
export const addDiary = async (req, res) => {
  try {
    const { userId, ...rest } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "userId ไม่ถูกต้องหรือไม่มี" });
    }

    const diary = new Diary({
      ...rest,
      userId: new mongoose.Types.ObjectId(userId),
    });

    await diary.save();
    res.status(201).json({ message: "เพิ่มบันทึกการนอนสำเร็จ", diary });

  } catch (err) {
    console.error("❌ Error saving diary:", err.message);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึก", error: err.message });
  }
};

// ✅ GET /api/diary?userId=xxx
export const getDiaries = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const diaries = await Diary.find(filter).sort({ date: -1 });
    res.json(diaries);
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
};
