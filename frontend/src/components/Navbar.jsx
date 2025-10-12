import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("authUser") || localStorage.getItem("user");
    try {
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed) setUser(parsed);
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    // ลบทั้งสองคีย์เผื่อจะมีทั้งสองแบบเก็บไว้ในระบบต่าง ๆ
    localStorage.removeItem("authUser");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);

    // ใช้ useNavigate() เพื่อ SPA-style navigation (ไม่รีเฟรชหน้า)
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">GoodNightHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-indigo-600">หน้าแรก</Link>
            <Link to="/inform" className="hover:text-indigo-600">การนอนไม่หลับ</Link>
            <Link to="/therapy" className="hover:text-indigo-600">วิธีการบำบัด</Link>
            <Link to="/psqi" className="hover:text-indigo-600">แบบทดสอบฝันดี</Link>
            <Link to="/sleepdiary" className="hover:text-indigo-600">บันทึกฝันหวาน</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm font-medium text-gray-800">
                  👋 สวัสดี, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:underline"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
