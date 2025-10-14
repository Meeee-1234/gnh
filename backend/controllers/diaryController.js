// controllers/diaryController.js
import Diary from "../models/Diary.js";

export const addDiary = async (req, res) => {
  try {
    console.log("📦 Received Diary Payload:", req.body); // ➕ เพิ่มบรรทัดนี้เพื่อดูว่ารับอะไรมา
    const diary = new Diary(req.body);
    await diary.save();
    res.status(201).json({ message: "เพิ่มบันทึกการนอนสำเร็จ", diary });
  } catch (err) {
    console.error("❌ Error saving diary:", err); // ➕ เพิ่ม log
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
};

export const getDiaries = async (req, res) => {
  try {
    const { userId } = req.query;
    const diaries = await Diary.find({ userId }).sort({ date: -1 });
    res.json(diaries);
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
};
