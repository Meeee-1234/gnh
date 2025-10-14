// models/Diary.js
import mongoose from "mongoose";

const diarySchema = new mongoose.Schema({
  // 🔹 ผู้ใช้งาน
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // 🔹 วันที่ (string ในรูปแบบ yyyy-mm-dd)
  date: { type: String, required: true },

  // 🔹 ส่วนที่ 1: ข้อมูลเวลา
  bedTime: { type: String, default: "" },             // เวลาเข้านอน (hh:mm)
  sleepAttemptTime: { type: String, default: "" },    // เวลาพยายามนอน
  sleepLatency: { type: Number, default: 0 },         // ใช้เวลากี่นาทีหลับ
  awakenings: { type: Number, default: 0 },           // ตื่นกลางดึกกี่ครั้ง
  awakeDuration: { type: Number, default: 0 },        // เวลาที่ตื่นรวม (นาที)
  finalWakeTime: { type: String, default: "" },       // เวลาตื่นสุดท้าย
  outOfBedTime: { type: String, default: "" },        // เวลาลุกจากเตียง

  // 🔹 ส่วนที่ 2: การประเมินคุณภาพการนอน
  totalSleepTime: { type: Number, default: 0 },       // ชั่วโมงการนอนรวม
  sleepQuality: { type: Number, required: true },     // ระดับคุณภาพการนอน (1–5)
  refreshed: { type: Number, required: true },        // ระดับความสดชื่น (1–5)
  morningFatigue: { type: Number, required: true },   // ระดับความง่วง (1–5)
  caffeineAfter18: { type: Number, default: 0 },      // ระดับการดื่มคาเฟอีน
  screenBeforeBed: { type: Number, default: 0 },      // ระยะเวลาหน้าจอก่อนนอน
  stressEvent: { type: String, default: "" },         // เหตุการณ์เครียด (optional)
  note: { type: String, default: "" }                 // หมายเหตุเพิ่มเติม
});

export default mongoose.model("Diary", diarySchema);
