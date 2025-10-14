import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Profile() {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("authUser")); // ดึง user จาก localStorage
  const userId = user?._id || null;

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const res = await fetch(`${API}/api/diary?userId=${userId}`);
        const data = await res.json();
        setDiaries(data.slice(-7).reverse()); // 7 วันล่าสุด
        setLoading(false);
      } catch (err) {
        console.error("Error fetching diaries:", err);
      }
    };
    if (userId) fetchDiaries();
  }, [userId]);

  if (loading) return <p>⏳ กำลังโหลด...</p>;

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/"; // รีเฟรชกลับไปหน้าแรก
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <button onClick={handleLogout}>Logout</button>


      <h1 className="text-2xl font-bold mb-4">📊 แนวโน้มการนอนของคุณ</h1>

      <LineChart width={600} height={300} data={diaries}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="totalSleepTime" stroke="#6366f1" name="เวลานอน (ชม.)" />
        <Line type="monotone" dataKey="sleepQuality" stroke="#16a34a" name="คุณภาพการนอน" />
      </LineChart>

      <div className="mt-6">
        <Link to="/sleepdiary" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          ➕ เพิ่มข้อมูล Sleep Diary
        </Link>
      </div>
    </div>
  );
}
