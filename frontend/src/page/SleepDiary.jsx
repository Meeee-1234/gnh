// SleepDiary.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export default function SleepDiary() {
  const [form, setForm] = useState({
    date: "",
    bedTime: "",
    sleepAttemptTime: "",
    sleepLatency: "",
    awakenings: "",
    awakeDuration: "",
    finalWakeTime: "",
    outOfBedTime: "",
    totalSleepTime: "",
    sleepQuality: "",
    refreshed: "",
    morningFatigue: "",
    caffeineAfter18: "",
    screenBeforeBed: "",
    stressEvent: "",
    note: "",
  });

  const [diaries, setDiaries] = useState([]);
  const user = JSON.parse(localStorage.getItem("auth:user") || "{}");
  console.log("🧑‍💻 User from localStorage:", user); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user._id) {
    alert("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
    return;
  }

  const payload = {
  ...form,
  userId: user._id,
  sleepLatency: Number(form.sleepLatency),
  awakenings: Number(form.awakenings),
  awakeDuration: Number(form.awakeDuration),
  totalSleepTime: Number(form.totalSleepTime),
  sleepQuality: Number(form.sleepQuality || 0),       // ✅ Fallback
  refreshed: Number(form.refreshed || 0),             // ✅ Fallback
  morningFatigue: Number(form.morningFatigue || 0),   // ✅ Fallback
  caffeineAfter18: Number(form.caffeineAfter18 || 0),
  screenBeforeBed: Number(form.screenBeforeBed || 0),
  stressEvent: form.stressEvent?.trim() || "",
  note: form.note?.trim() || "",
};

  try {
    console.log("📤 Payload", payload); 
    await axios.post(`${API}/api/diary`, payload);
    setForm({
      date: "",
      bedTime: "",
      sleepAttemptTime: "",
      sleepLatency: "",
      awakenings: "",
      awakeDuration: "",
      finalWakeTime: "",
      outOfBedTime: "",
      totalSleepTime: "",
      sleepQuality: "",
      refreshed: "",
      morningFatigue: "",
      caffeineAfter18: "",
      screenBeforeBed: "",
      stressEvent: "",
      note: "",
    });
    fetchDiaries();
  } catch (err) {
    console.error("❌ Error submitting form:", err.response?.data || err.message);
    alert("เกิดข้อผิดพลาดในการบันทึก กรุณาตรวจสอบข้อมูล");
  }
};


  const fetchDiaries = async () => {
    const { data } = await axios.get(`${API}/api/diary?userId=${user._id}`);
    setDiaries(data);
  };

  useEffect(() => {
    if (user?._id) fetchDiaries();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        🛌 Sleep Diary (แบบบันทึกการนอนประจำวัน)
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold border-b pb-2 mb-3">🕰 ส่วนที่ 1: ข้อมูลเวลา</h2>



        <div>
          <label className="block font-medium mb-1">📅 วันที่ที่ต้องการบันทึก</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">1. คุณเข้านอนเวลาเท่าไร? (ตัวอย่าง: 22:30 น.)</label>
          <input type="time" name="bedTime" value={form.bedTime} onChange={handleChange} required className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block font-medium mb-1">2. คุณเริ่มพยายามนอนหลับเวลาเท่าไร? (เวลาที่ปิดไฟและตั้งใจจะนอนจริง ๆ)</label>
          <input type="time" name="sleepAttemptTime" value={form.sleepAttemptTime} onChange={handleChange} required className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block font-medium mb-1">3. คุณใช้เวลาประมาณกี่นาทีกว่าจะหลับ? (เช่น 10 นาที, 20 นาที)</label>
          <input type="number" name="sleepLatency" value={form.sleepLatency} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block font-medium mb-1">4. คุณตื่นกลางดึกกี่ครั้ง (ไม่รวมการตื่นตอนเช้า)?</label>
          <input type="number" name="awakenings" value={form.awakenings} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block font-medium mb-1">5. รวมแล้วช่วงที่ตื่นกลางดึกใช้เวลาประมาณกี่นาที? (เช่น 15 นาที, 30 นาที)</label>
          <input type="number" name="awakeDuration" value={form.awakeDuration} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block font-medium mb-1">6. คุณตื่นครั้งสุดท้ายเวลาเท่าไร?</label>
          <input type="time" name="finalWakeTime" value={form.finalWakeTime} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block font-medium mb-1">7. คุณลุกจากเตียงเวลาเท่าไร? (เวลาที่เริ่มวันใหม่จริง ๆ)</label>
          <input type="time" name="outOfBedTime" value={form.outOfBedTime} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>

        <h2 className="text-lg font-semibold border-b pb-2 mt-6 mb-3">🛌 ส่วนที่ 2: การประเมินคุณภาพการนอน</h2>

        <div>
          <label className="block font-medium mb-1">8. คุณคิดว่าคุณนอนหลับรวมทั้งหมดกี่ชั่วโมง?</label>
          <input type="number" step="0.1" name="totalSleepTime" value={form.totalSleepTime} onChange={handleChange} placeholder="เช่น 6.5, 7, 8 ชั่วโมง" className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block font-medium mb-1">9. คุณภาพการนอนเมื่อคืนนี้เป็นอย่างไร?</label>
          <select name="sleepQuality" value={form.sleepQuality} onChange={handleChange} required className="border p-2 rounded w-full">
            <option value="">เลือกระดับ</option>
            <option value="1">แย่มาก</option>
            <option value="2">แย่</option>
            <option value="3">ปานกลาง</option>
            <option value="4">ดี</option>
            <option value="5">ดีมาก</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">10. เมื่อคุณตื่น คุณรู้สึกสดชื่นหรือพักผ่อนเพียงพอหรือไม่?</label>
          <select name="refreshed" value={form.refreshed} onChange={handleChange} required className="border p-2 rounded w-full">
            <option value="">เลือกความรู้สึก</option>
            <option value="1">ไม่เลย</option>
            <option value="2">นิดหน่อย</option>
            <option value="3">ปานกลาง</option>
            <option value="4">มาก</option>
            <option value="5">มากที่สุด</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">11. คุณรู้สึกง่วงหรือเหนื่อยในช่วงเช้าวันนี้หรือไม่?</label>
          <select name="morningFatigue" value={form.morningFatigue} onChange={handleChange} required className="border p-2 rounded w-full">
            <option value="">เลือกระดับ</option>
            <option value="1">ไม่เลย</option>
            <option value="2">เล็กน้อย</option>
            <option value="3">ปานกลาง</option>
            <option value="4">มาก</option>
            <option value="5">ง่วงมาก</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">12. คุณดื่มคาเฟอีนหลังเวลา 18:00 น. หรือไม่?</label>
          <select name="caffeineAfter18" value={form.caffeineAfter18} onChange={handleChange} required className="border p-2 rounded w-full">
            <option value="">เลือกคำตอบ</option>
            <option value="0">ไม่ดื่ม</option>
            <option value="1">ดื่มเล็กน้อย</option>
            <option value="2">ดื่มมาก</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">13. คุณใช้โทรศัพท์หรืออุปกรณ์อิเล็กทรอนิกส์ก่อนนอนหรือไม่?</label>
          <select name="screenBeforeBed" value={form.screenBeforeBed} onChange={handleChange} required className="border p-2 rounded w-full">
            <option value="">เลือกคำตอบ</option>
            <option value="0">ไม่เลย</option>
            <option value="1">ภายใน 30 นาที</option>
            <option value="2">ภายใน 1 ชั่วโมง</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">14. มีเหตุการณ์หรือความเครียดที่อาจส่งผลต่อการนอนเมื่อคืนนี้หรือไม่?</label>
          <input type="text" name="stressEvent" value={form.stressEvent} onChange={handleChange} placeholder="เช่น เครียดเรื่องสอบ, ไม่มี" className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block font-medium mb-1">15. หมายเหตุเพิ่มเติม (ถ้ามี)</label>
          <textarea name="note" value={form.note} onChange={handleChange} placeholder="บันทึกเพิ่มเติม..." className="border p-2 rounded w-full" />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full mt-4">
          บันทึกข้อมูล
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">📅 ประวัติการนอน</h2>
      <table className="w-full border text-center text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th>วันที่</th>
            <th>ชั่วโมงนอน</th>
            <th>คุณภาพ</th>
            <th>สดชื่น</th>
            <th>ง่วง</th>
            <th>หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          {diaries.map((d) => (
            <tr key={d._id}>
              <td>{d.date}</td>
              <td>{d.totalSleepTime}</td>
              <td>{d.sleepQuality}</td>
              <td>{d.refreshed}</td>
              <td>{d.morningFatigue}</td>
              <td>{d.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
