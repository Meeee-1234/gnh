import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("psqi");
  const [viewMode, setViewMode] = useState("7days"); // "7days" หรือ "weekly"
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("authUser"));
  const userId =
    user?._id || user?.id || user?.user?._id || user?.user?.id || null;

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const res = await fetch(`${API}/api/diary?userId=${userId}`);
        const data = await res.json();
        setDiaries(data.slice(-30).reverse());
      } catch (err) {
        console.error("❌ Error fetching diaries:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchDiaries();
    else setLoading(false);
  }, [userId]);

  if (loading) return <p>⏳ กำลังโหลด...</p>;

  // 🧮 สร้างข้อมูลรายสัปดาห์
  const getWeeklyData = () => {
    if (!diaries.length) return [];
    const groups = {};
    diaries.forEach((d) => {
      if (!d.date) return;
      const date = new Date(d.date);
      const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      if (!groups[weekKey]) groups[weekKey] = [];
      groups[weekKey].push(d);
    });

    return Object.entries(groups).map(([week, entries]) => {
      const avgSleep =
        entries.reduce((s, e) => s + (e.totalSleepTime || 0), 0) /
        entries.length;
      const avgQuality =
        entries.reduce((s, e) => s + (e.sleepQuality || 0), 0) /
        entries.length;
      return { week, avgSleep, avgQuality };
    });
  };

  const weeklyData = getWeeklyData();

  // 💬 Feedback รายวัน
  const generateDailyFeedback = () => {
    const last7 = diaries.slice(-7);
    if (!last7.length) return "ยังไม่มีข้อมูลย้อนหลัง 7 วัน";

    const avgSleep =
      last7.reduce((sum, d) => sum + (d.totalSleepTime || 0), 0) / last7.length;
    const avgQuality =
      last7.reduce((sum, d) => sum + (d.sleepQuality || 0), 0) / last7.length;
    const avgRefreshed =
      last7.reduce((sum, d) => sum + (d.refreshed || 0), 0) / last7.length;

    let fb = "";

    if (avgSleep < 6)
      fb +=
        "⏰ ในช่วง 7 วันที่ผ่านมา คุณนอนเฉลี่ยน้อยกว่า 6 ชั่วโมง ควรเพิ่มเวลานอนเพื่อให้ร่างกายฟื้นตัว\n";
    else if (avgSleep < 7)
      fb +=
        "🌙 เวลานอนเฉลี่ยอยู่ที่ประมาณ 6–7 ชั่วโมง ถือว่าพอใช้ แต่ควรนอนให้ครบ 7–8 ชั่วโมง\n";
    else fb += "😴 คุณนอนเพียงพอในช่วงสัปดาห์นี้ เยี่ยมมาก!\n";

    if (avgQuality < 3)
      fb +=
        "💤 คุณภาพการนอนค่อนข้างต่ำ แนะนำลดการใช้มือถือก่อนนอนและจัดห้องให้มืดเงียบ\n";
    else if (avgQuality < 4)
      fb +=
        "🛏️ คุณภาพการนอนปานกลาง ลองฝึกการหายใจหรือฟังเพลงผ่อนคลายก่อนนอน\n";
    else fb += "🌟 คุณภาพการนอนดีมาก รักษาพฤติกรรมนี้ต่อไป!\n";

    if (avgRefreshed < 3)
      fb +=
        "☀️ คุณมักรู้สึกไม่สดชื่นหลังตื่น ลองเพิ่มเวลานอนหรือเลี่ยงคาเฟอีนหลัง 18:00 น.\n";

    return fb.trim();
  };

  // 💬 Feedback รายสัปดาห์
  const generateWeeklyFeedback = () => {
    if (!weeklyData.length) return "ยังไม่มีข้อมูลรายสัปดาห์";

    const latestWeek = weeklyData[weeklyData.length - 1];
    let fb = `📅 สัปดาห์ล่าสุด (${latestWeek.week})\n`;

    if (latestWeek.avgSleep < 6)
      fb += "⏰ เวลานอนเฉลี่ยของคุณต่ำกว่า 6 ชม. ควรปรับเวลานอนให้เร็วขึ้น\n";
    else if (latestWeek.avgSleep < 7)
      fb += "🌙 เวลานอนเฉลี่ยพอใช้ แต่ควรนอนให้ครบ 7–8 ชม. เพื่อความสดชื่น\n";
    else fb += "😴 เวลานอนเฉลี่ยดีมาก! รักษาพฤติกรรมการนอนนี้ต่อไป\n";

    if (latestWeek.avgQuality < 3)
      fb +=
        "💤 คุณภาพการนอนเฉลี่ยต่ำ แนะนำให้ลดความเครียดและสร้างสภาพแวดล้อมที่สงบก่อนนอน\n";
    else if (latestWeek.avgQuality < 4)
      fb += "🛌 คุณภาพการนอนเฉลี่ยปานกลาง สามารถพัฒนาได้อีกเล็กน้อย\n";
    else fb += "🌟 คุณภาพการนอนเฉลี่ยดีมากในสัปดาห์นี้!\n";

    return fb.trim();
  };

  // ======== 🎯 PSQI ข้อมูลจำลองก่อนและหลัง ========
  const psqiData = [
    { name: "ก่อนใช้งาน (Pre)", score: 13 },
    { name: "หลังใช้งาน (Post)", score: 8 },
  ];

  // ======== UI ========
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">👤 โปรไฟล์ผู้ใช้งาน</h1>

      {/* ปุ่มสลับแท็บหลัก */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setActiveTab("psqi")}
          className={`px-6 py-2 rounded-lg font-medium ${
            activeTab === "psqi"
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          📋 ผลการประเมิน PSQI
        </button>

        <button
          onClick={() => setActiveTab("sleep")}
          className={`px-6 py-2 rounded-lg font-medium ${
            activeTab === "sleep"
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          🛌 Sleep Diary
        </button>
      </div>

      {/* เนื้อหา */}
      {activeTab === "psqi" ? (
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">📋 ผลการประเมิน PSQI</h2>

          <p className="text-gray-700 mb-4">
            ค่า PSQI (Pittsburgh Sleep Quality Index) ใช้ในการประเมินคุณภาพการนอน  
            โดยค่าที่น้อยลงหมายถึงคุณภาพการนอนที่ดีขึ้น
          </p>

          {/* ✅ กราฟเส้นแสดงการเปลี่ยนแปลงก่อน–หลัง */}
          <div className="bg-gray-50 p-4 rounded-xl shadow-inner mb-6">
            <h3 className="text-lg font-semibold mb-3 text-center text-indigo-700">
              📈 แนวโน้มคะแนน PSQI ก่อน–หลัง
            </h3>
            <LineChart width={600} height={300} data={psqiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 21]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 6 }}
                name="คะแนน PSQI"
              />
            </LineChart>
          </div>

          {/* 🔍 สรุปผล */}
          <p className="text-lg text-gray-800">
            📊 ก่อนใช้งาน: <b>13</b> คะแนน &nbsp; → &nbsp; หลังใช้งาน: <b>8</b> คะแนน
          </p>
          <p className="text-green-700 font-semibold mt-2">
            ✅ คะแนนลดลง แสดงว่าคุณภาพการนอนของคุณดีขึ้นหลังใช้งานระบบ
          </p>
        </div>
      ) : (
        <div>
          {/* ปุ่มเลือกช่วงเวลา */}
          <div className="flex justify-center mb-6 space-x-3">
            <button
              onClick={() => setViewMode("7days")}
              className={`px-5 py-2 rounded-lg font-medium ${
                viewMode === "7days"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-800 hover:bg-gray-400"
              }`}
            >
              📆 7 วันล่าสุด
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-5 py-2 rounded-lg font-medium ${
                viewMode === "weekly"
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-800 hover:bg-gray-400"
              }`}
            >
              📅 รายสัปดาห์
            </button>
          </div>

          {/* ======= แสดงตามโหมดที่เลือก ======= */}
          {viewMode === "7days" ? (
            <>
              {/* กราฟรายวัน */}
              <div className="bg-white p-4 rounded-xl shadow-md mb-4">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  📊 กราฟย้อนหลัง 7 วันล่าสุด
                </h2>
                <LineChart width={600} height={300} data={diaries.slice(-7)}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalSleepTime"
                    stroke="#6366f1"
                    name="เวลานอน (ชม.)"
                  />
                  <Line
                    type="monotone"
                    dataKey="sleepQuality"
                    stroke="#16a34a"
                    name="คุณภาพการนอน"
                  />
                </LineChart>
              </div>

              {/* Feedback รายวัน */}
              <div className="bg-blue-500 text-white p-5 rounded-xl shadow-lg mb-8 border border-blue-200">
                <h3 className="text-lg font-semibold mb-2 text-center">
                  💬 Feedback (7 วันล่าสุด)
                </h3>
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {generateDailyFeedback()}
                </pre>
              </div>
            </>
          ) : (
            <>
              {/* กราฟรายสัปดาห์ */}
              <div className="bg-white p-4 rounded-xl shadow-md mb-4">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  📅 กราฟเฉลี่ยการนอนรายสัปดาห์
                </h2>
                <LineChart width={600} height={300} data={weeklyData}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgSleep"
                    stroke="#3b82f6"
                    name="เวลานอนเฉลี่ย (ชม.)"
                  />
                  <Line
                    type="monotone"
                    dataKey="avgQuality"
                    stroke="#10b981"
                    name="คุณภาพเฉลี่ย"
                  />
                </LineChart>
              </div>

              {/* Feedback รายสัปดาห์ */}
              <div className="bg-green-500 text-white p-5 rounded-xl shadow-lg mb-8 border border-green-200">
                <h3 className="text-lg font-semibold mb-2 text-center">
                  💬 Feedback (รายสัปดาห์)
                </h3>
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {generateWeeklyFeedback()}
                </pre>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
