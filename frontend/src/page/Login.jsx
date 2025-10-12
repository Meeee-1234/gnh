import React, { useState } from "react";

const API = process.env.REACT_APP_API_URL;

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // clear ก่อน submit ใหม่

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("เข้าสู่ระบบสำเร็จ 🎉");
        localStorage.setItem("authUser", JSON.stringify(data.user)); // ✅ ให้ตรงกับ key ที่ getAuthUserIdOrNull() ใช้
        localStorage.setItem("token", data.token);

        // รีไดเรกหน้า (เช่น ไปหน้า Home)
        window.location.href = "/";
      } else {
        setMessage(data.message || "เข้าสู่ระบบไม่สำเร็จ");
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
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

        {message && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@gmail.com"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••"
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
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-indigo-600 font-medium cursor-pointer hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
