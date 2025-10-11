import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 text-white shadow-xl">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

        <div className="relative p-8 md:p-14">
          <p className="text-sm uppercase tracking-wider text-white/80">Sleep Health Toolkit</p>
          <h1 className="mt-1 text-3xl md:text-5xl font-extrabold leading-tight">
            ช่วยจัดระเบียบการนอน <br className="hidden md:block" />
            พร้อมคัดกรอง & ติดตามผลแบบง่าย
          </h1>
          <p className="mt-4 max-w-2xl text-white/90 md:text-lg">
            แบบประเมิน <b>PSQI</b>, บันทึก <b>SleepDiary</b>, และโปรแกรม <b>dCBT-I</b> ในที่เดียว
            ออกแบบให้ใช้ง่ายบนมือถือ พร้อมอินไซต์จากกฎ <b>Rule-Based AI</b> ของคุณ
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/psqi" className="inline-flex items-center justify-center rounded-xl bg-white text-indigo-700 px-5 py-2.5 font-semibold shadow-sm hover:bg-indigo-50 transition">ทำแบบประเมิน PSQI</Link>
            <Link to="/sleep" className="inline-flex items-center justify-center rounded-xl border border-white/70 text-white px-5 py-2.5 font-semibold hover:bg-white/10 transition">เริ่มบันทึก SleepDiary</Link>
            <Link to="/dcbti" className="inline-flex items-center justify-center rounded-xl bg-indigo-900/40 text-white px-5 py-2.5 font-semibold hover:bg-indigo-900/60 transition">เรียนรู้ dCBT-I</Link>
          </div>

          <div className="mt-6 text-sm text-white/90">
            {user ? (
              <span>สวัสดี <b>{user.name || "ผู้ใช้"}</b> • ไปที่{" "}
                <Link to="/profile" className="underline">โปรไฟล์</Link>
              </span>
            ) : (
              <span>
                ยังไม่มีบัญชี?{" "}
                <Link to="/register" className="underline font-semibold">สมัครสมาชิก</Link>{" "}
                หรือ{" "}
                <Link to="/login" className="underline">เข้าสู่ระบบ</Link>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <FeatureCard
          title="ประเมินคุณภาพการนอน (PSQI)"
          desc="คัดกรองปัญหาการนอนหลับภายในไม่กี่นาที เพื่อวางแผนการดูแลต่อ"
          href="/psqi"
          cta="เริ่มประเมิน"
        />
        <FeatureCard
          title="ไดอารี่นอนใช้ง่าย"
          desc="กรอกเวลานอน/ตื่นและเหตุการณ์สำคัญในแต่ละวัน ดูแนวโน้มจริงแทนการคาดเดา"
          href="/sleep"
          cta="เริ่มบันทึก"
        />
        <FeatureCard
          title="โปรแกรม dCBT-I"
          desc="เรียนรู้และปรับพฤติกรรม-ความคิดที่รบกวนการนอน พร้อมเป้าหมายที่วัดผลได้"
          href="/dcbti"
          cta="อ่านวิธีทำ"
        />
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-12 rounded-3xl bg-white p-6 md:p-8 shadow ring-1 ring-black/5">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">เริ่มยังไงดี?</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {[{ n: "1", t: "คัดกรองปัญหา", d: "ทำแบบประเมิน PSQI เพื่อดูภาพรวมคุณภาพการนอน" },
            { n: "2", t: "ติดตามทุกวัน", d: "บันทึก SleepDiary เพื่อดูชั่วโมงนอน/ความสม่ำเสมอจริง" },
            { n: "3", t: "ปรับแผนเป็นขั้นตอน", d: "ทำ dCBT-I ตามสเต็ป พร้อมปรับตามข้อมูลจริง" },
          ].map((s) => (
            <li key={s.n} className="rounded-2xl border bg-white p-4">
              <div className="flex items-center gap-2 text-indigo-700 font-bold">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50">{s.n}</span> {s.t}
              </div>
              <p className="mt-2 text-sm text-gray-700">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/psqi" className="inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white px-4 py-2 font-semibold shadow-sm hover:bg-indigo-700 transition">เริ่มจาก PSQI</Link>
          <Link to="/inform" className="inline-flex items-center justify-center rounded-xl border px-4 py-2 font-medium hover:bg-gray-50">อ่านความรู้เรื่องนอนไม่หลับ</Link>
        </div>
      </section>

      {/* MINI FAQ */}
      <section className="mt-10">
        <h2 className="text-xl md:text-2xl font-bold">คำถามที่พบบ่อย (ย่อ)</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <FaqItem q="PSQI คืออะไร?" a="แบบประเมินคุณภาพการนอนหลับที่ใช้ในคลินิกเพื่อคัดกรองปัญหาและวัดความเปลี่ยนแปลง" />
          <FaqItem q="ต้องงีบไหม?" a="งีบสั้น 10–20 นาทีช่วงก่อนบ่ายสามช่วยได้ แต่การงีบเย็นหรือยาวทำให้หลับยาก" />
          <FaqItem q="dCBT-I ใช้เวลานานไหม?" a="ส่วนใหญ่เห็นความเปลี่ยนแปลงภายใน 4–8 สัปดาห์ หากทำต่อเนื่องและวัดผลสม่ำเสมอ" />
        </div>
      </section>

      {/* FOOT CTA */}
      <section className="mt-12 rounded-3xl bg-indigo-50 p-6 md:p-8 ring-1 ring-indigo-200">
        <h3 className="text-xl md:text-2xl font-bold text-indigo-900">
          พร้อมเริ่มดูแลการนอนของคุณแล้วหรือยัง?
        </h3>
        <p className="mt-1 text-indigo-900/80">
          เริ่มจากการคัดกรอง แล้วบันทึกไดอารี่นอนทุกวัน ระบบจะช่วยชี้เป้าสิ่งที่ควรปรับให้เห็นผลจริง
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/psqi" className="inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white px-4 py-2 font-semibold shadow-sm hover:bg-indigo-700 transition">ทำ PSQI ตอนนี้</Link>
          <Link to="/sleep" className="inline-flex items-center justify-center rounded-xl border border-indigo-300 text-indigo-700 bg-white px-4 py-2 font-medium hover:bg-indigo-50">เปิด SleepDiary</Link>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, desc, href, cta }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-gray-700 text-sm">{desc}</p>
      <div className="mt-3">
        <Link to={href} className="inline-flex items-center justify-center rounded-xl bg-gray-900 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-800 transition">
          {cta}
        </Link>
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border bg-white">
      <button onClick={() => setOpen(!open)} className="w-full text-left px-4 py-3 flex items-center justify-between">
        <span className="font-medium text-gray-900">{q}</span>
        <span className="text-gray-400">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-4 pb-4 text-gray-600 text-sm">{a}</div>}
    </div>
  );
}
