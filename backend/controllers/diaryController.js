
import Diary from "../models/Diary.js";

export const addDiary = async (req, res) => {
  try {
    const diary = new Diary(req.body);
    await diary.save();
    res.status(201).json({ message: "เพิ่มบันทึกการนอนสำเร็จ", diary });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
};

export const getDiaries = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {}; // ถ้าไม่มี userId ให้ดึงทั้งหมด
    const diaries = await Diary.find(filter).sort({ date: -1 });
    res.json(diaries);
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
};
