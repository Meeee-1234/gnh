import React, { useState } from "react";

const API = process.env.REACT_APP_API_URL;

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ สมัครสำเร็จ
        setMessage(data.message || "สมัครสมาชิกเรียบร้อยแล้ว!");

        // ✅ รอ 1.5 วินาทีแล้วเปลี่ยนหน้าไป /login
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        // ❌ สมัครไม่สำเร็จ
        setMessage(data.message || "สมัครไม่สำเร็จ กรุณาลองใหม่");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-sky-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <img src="/image/GNH.png" alt="logo" className="mx-auto mb-4" width={150} height={80} /><br/>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">สมัครสมาชิก</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ</label>
            <input
              type="text"
              name="name"
              placeholder="ชื่อ"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
            <input
              type="email"
              name="email"
              placeholder="อีเมล"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <input
              type="password"
              name="password"
              placeholder="รหัสผ่าน"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition disabled:opacity-60"
          >
            สมัครสมาชิก
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}

        <p className="text-center text-sm text-gray-600 mt-6"> Already have an account? {" "}
            <a href="/login" className="text-indigo-600 font-medium cursor-pointer hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
