import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function SleepDiary() {
  const [form, setForm] = useState({
    date: "",
    sleepTime: "",
    wakeTime: "",
    mood: "",
    note: "",
  });
  const [diaries, setDiaries] = useState([]);

  const user = JSON.parse(localStorage.getItem("auth:user") || "{}");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateHours = (sleep, wake) => {
    const s = new Date(`2000-01-01T${sleep}`);
    const w = new Date(`2000-01-02T${wake}`);
    return (w - s) / (1000 * 60 * 60);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalHours = calculateHours(form.sleepTime, form.wakeTime);
    const payload = { ...form, userId: user._id, totalHours };
    await axios.post(`${API}/api/diary`, payload);
    setForm({ date: "", sleepTime: "", wakeTime: "", mood: "", note: "" });
    fetchDiaries();
  };

  const fetchDiaries = async () => {
    const { data } = await axios.get(`${API}/api/diary?userId=${user._id}`);
    setDiaries(data);
  };

  useEffect(() => {
    if (user?.id) fetchDiaries();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🛌 Sleep Diary</h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="time"
            name="sleepTime"
            value={form.sleepTime}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="time"
            name="wakeTime"
            value={form.wakeTime}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>
        <select
          name="mood"
          value={form.mood}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        >
          <option value="">-- ความรู้สึกตอนตื่น --</option>
          <option value="สดชื่น">สดชื่น</option>
          <option value="ง่วง">ง่วง</option>
          <option value="เครียด">เครียด</option>
        </select>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="บันทึกเพิ่มเติม..."
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          บันทึกข้อมูล
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">📅 ประวัติการนอน</h2>
      <table className="w-full border text-center">
        <thead className="bg-gray-100">
          <tr>
            <th>วันที่</th>
            <th>เวลานอน</th>
            <th>เวลาตื่น</th>
            <th>ชั่วโมง</th>
            <th>ความรู้สึก</th>
            <th>หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          {diaries.map((d) => (
            <tr key={d._id}>
              <td>{d.date}</td>
              <td>{d.sleepTime}</td>
              <td>{d.wakeTime}</td>
              <td>{d.totalHours.toFixed(1)}</td>
              <td>{d.mood}</td>
              <td>{d.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
