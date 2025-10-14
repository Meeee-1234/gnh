
import { useMemo, useState } from "react";

const API = process.env.REACT_APP_API_URL;

// ดึง user_id ของคนที่ login อยู่จาก localStorage
function getAuthUserIdOrNull() {
  try {
    const rawNew = localStorage.getItem("authUser");
    const rawOld = localStorage.getItem("auth:user");

    // ถ้ามี key ใหม่และเก่า ให้ลบของเก่าออก
    if (rawNew && rawOld) localStorage.removeItem("auth:user");

    const parse = (s) => {
      if (!s || s === "null" || s === "undefined") return null;
      try {
        return JSON.parse(s);
      } catch {
        return null;
      }
    };

    const uNew = parse(rawNew);
    if (uNew && (uNew.id || uNew.user?.id || uNew._id || uNew.user?._id)) {
      return uNew.id ?? uNew.user?.id ?? uNew._id ?? uNew.user?._id ?? null;
    }

    const uOld = parse(rawOld);
    return uOld?.id ?? uOld?.user?.id ?? uOld?._id ?? uOld?.user?._id ?? null;
  } catch {
    return null;
  }
}

// choice ข้อ 5,7,8,10.1-10.5
const question578and10Item = [
  { value: 0, label: "ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา" },
  { value: 1, label: "น้อยกว่า 1 ครั้งต่อสัปดาห์" },
  { value: 2, label: "1 หรือ 2 ครั้งต่อสัปดาห์" },
  { value: 3, label: "3 ครั้งต่อสัปดาห์ขึ้นไป" },
];

// choice ข้อ 6
const question6 = [
  { value: "very_good", label: "ดีมาก" },
  { value: "fairly_good", label: "ค่อนข้างดี" },
  { value: "fairly_bad", label: "ค่อนข้างแย่" },
  { value: "very_bad", label: "แย่มาก" },
];

// choice ข้อ 9
const question9 = [
  { value: 0, label: "ไม่มีปัญหาเลยแม้แต่น้อย" },
  { value: 1, label: "มีปัญหาเพียงเล็กน้อย" },
  { value: 2, label: "ค่อนข้างที่จะเป็นปัญหา" },
  { value: 3, label: "เป็นปัญหาอย่างมาก" },
];

// choice ข้อ 10
const question10 = [
  { value: 0, label: "ไม่มีเลย" },
  { value: 1, label: "มี แต่แยกนอนคนละห้อง" },
  { value: 2, label: "มี และนอนในห้องเดียวกัน แต่คนละเตียง" },
  { value: 3, label: "มี และนอนเตียงเดียวกัน" },
];

/* Q10 follow-ups (สำหรับถามคู่นอน/ผู้อยู่ร่วม) – ไม่ถูกนับในคะแนน PSQI */
const q10Items = [
  { key: "q101", label: "10.1 กรนเสียงดัง" },
  { key: "q102", label: "10.2 มีช่วงหยุดหายใจเป็นระยะเวลานานขณะหลับ" },
  { key: "q103", label: "10.3 ขากระตุก/กระสับกระส่ายขณะหลับ" },
  { key: "q104", label: "10.4 สับสน/สับสนขณะหลับ (เช่น พูดละเมอ)" },
  { key: "q105", label: "10.5 อาการอื่นๆ ที่สังเกตเห็น" },
];

/* ---------- Utils เวลา/คะแนน ---------- */

// toMinutes(str) => รับเวลาในรูปแบบ "HH:MM" แล้วแปลงเป็น "จำนวนนาทีรวม" เช่น 02.30 -> 150 นาที
function toMinutes(str) {
  if (!str || !/^\d{1,2}:\d{2}$/.test(str)) return null;
  const [h, m] = str.split(":").map((n) => parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

// คำนวณชั่วโมงการนอน
// คำนวณ “เวลาบนเตียง (Time in bed)” เผื่อข้ามเที่ยงคืน
function timeInBedMinutes(bedtime, wakeTime) {
  const b = toMinutes(bedtime);
  const w = toMinutes(wakeTime);
  if (b == null || w == null) return null;
  return w > b ? w - b : w + 24 * 60 - b;
}
        /* Rule-Based AI */
// Component 1 : ความพึงพอใจในการนอน
function scoreC1(q6) {
  switch (q6) {
    case "very_good": return 0;
    case "fairly_good": return 1;
    case "fairly_bad": return 2;
    case "very_bad": return 3;
    default: return null;
  }
}


// แปกๆ ติดไว้ก่อน
// Component 2 : ระยะเวลาหลับ (Sleep Latency)
function scoreC2(sleepLatencyMin, q51) {
  if (sleepLatencyMin == null || q51 == null) return null;
  let lat;
  if (sleepLatencyMin <= 15) lat = 0;
  else if (sleepLatencyMin <= 30) lat = 1;
  else if (sleepLatencyMin <= 60) lat = 2;
  else lat = 3;
  const sum = lat + q51;
  if (sum === 0) return 0;
  if (sum <= 2) return 1;
  if (sum <= 4) return 2;
  return 3;
}
// component 3: Sleep Duration (ชั่วโมงที่นอนจริง Q4)
function scoreC3(hours) {
  if (hours == null) return null;
  if (hours > 7) return 0;
  if (hours >= 6) return 1;
  if (hours >= 5) return 2;
  return 3;
}

// component 4: Habitual Sleep Efficiency (sleepHours / timeInBed)
function scoreC4(sleepHours, timeInBedMin) {
  if (sleepHours == null || timeInBedMin == null || timeInBedMin <= 0) return null;
  const efficiency = (sleepHours * 60) / timeInBedMin * 100;
  if (efficiency > 85) return 0;
  if (efficiency >= 75) return 1;
  if (efficiency >= 65) return 2;
  return 3;
}
function scoreC5(q5) {
  const keys = ["q52", "q53", "q54", "q55", "q56", "q57", "q58", "q59", "q510"];
  if (!q5 || keys.some((k) => q5[k] == null)) return null;
  const sum = keys.reduce((acc, k) => acc + (q5[k] || 0), 0);
  if (sum === 0) return 0;
  if (sum <= 9) return 1;
  if (sum <= 18) return 2;
  return 3;
}

function scoreC6(q7) {
  if (q7 == null) return null;
  return q7;
}

function scoreC7(q8, q9) {
  if (q8 == null || q9 == null) return null;
  const sum = q8 + q9;
  if (sum === 0) return 0;
  if (sum <= 2) return 1;
  if (sum <= 4) return 2;
  return 3;
}

function interpretPSQI(globalScore) {
  if (globalScore == null) return null;
  if (globalScore <= 5) return { level: "คุณภาพการนอนดี", color: "text-emerald-700", hint: "โดยรวมไม่มีปัญหาการนอนที่ชัดเจน" };
  if (globalScore <= 10) return { level: "มีปัญหาการนอนระดับเล็กน้อย-ปานกลาง", color: "text-amber-700", hint: "ลองปรับพฤติกรรมการนอน และติดตามอาการ" };
  return { level: "มีปัญหาการนอนระดับมาก", color: "text-rose-700", hint: "ควรพิจารณาปรึกษาแพทย์/ผู้เชี่ยวชาญด้านการนอน" };
}
/* ---------- UI Components ---------- */
function TimeSelect({ label, value, onChange, required }) {
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55], []);

  const [h, m] = (value || "").split(":");
  const hour = h ? parseInt(h) : 22;
  const minute = m ? parseInt(m) : 0;

  const handle = (newH, newM) => {
    const hh = String(newH).padStart(2, "0");
    const mm = String(newM).padStart(2, "0");
    onChange(`${hh}:${mm}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-gray-800">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      <div className="flex items-center gap-3">
        <select
          className="rounded-xl border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={hour}
          onChange={(e) => handle(parseInt(e.target.value), minute)}
        >
          {hours.map((h) => (
            <option key={h} value={h}>
              {h.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
        <span className="text-gray-600">:</span>
        <select
          className="rounded-xl border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={minute}
          onChange={(e) => handle(hour, parseInt(e.target.value))}
        >
          {minutes.map((m) => (
            <option key={m} value={m}>
              {m.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
        <span className="text-gray-500">น.</span>
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, suffix, placeholder, required, min = 0, max }) {
  const str = (v) => (v === 0 || v ? String(v) : "");

  const handleChange = (e) => {
    const cleaned = e.target.value.replace(/[^\d]/g, "");
    onChange(cleaned);
  };

  const handleBlur = () => {
    if (value === "" || value == null) return;
    let n = parseInt(value, 10);
    if (!Number.isFinite(n)) return;
    if (max !== undefined && n > max) n = max;
    if (min !== undefined && n < min) n = min;
    onChange(String(n));
  };

  const handleKeyDown = (e) => {
    const ok = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
    if (ok.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-gray-800">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-40 rounded-xl border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={str(value)}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
        />
        {suffix && <span className="text-gray-600">{suffix}</span>}
      </div>
    </div>
  );
}

function RadioGroup({ name, value, onChange, options, inline = false }) {
  return (
    <div className={inline ? "flex flex-wrap gap-3" : "flex flex-col gap-2"}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm hover:border-indigo-300"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={String(value) === String(opt.value)}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-gray-800">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

export default function PSQISleepForm() {
  
  // กำหนดค่าเริ่มต้นตัวแปรทั้งหลาย
  const [bedtime, setBedtime] = useState("22:30");
  const [sleepLatencyMin, setSleepLatencyMin] = useState(0);
  const [wakeTime, setWakeTime] = useState("06:30");
  const [sleepHours, setSleepHours] = useState(0);

  const [q5, setQ5] = useState({
    q51: null, q52: null, q53: null, q54: null, q55: null,
    q56: null, q57: null, q58: null, q59: null, q510: null,
  });

  const [q6, setQ6] = useState("");
  const [q7, setQ7] = useState(null);
  const [q8, setQ8] = useState(null);
  const [q9, setQ9] = useState(null);
  const [q10, setQ10] = useState(null);

  const showQ10FollowUps = q10 === 1 || q10 === 2 || q10 === 3;

  const [q10x, setQ10x] = useState({
    q101: null, q102: null, q103: null, q104: null, q105: null,
  });

  const [result, setResult] = useState(null); // เก็บผลรวม/รายองค์ประกอบ

  const handleQ5 = (key, val) => setQ5((s) => ({ ...s, [key]: val }));
  const handleQ10x = (key, val) => setQ10x((s) => ({ ...s, [key]: val }));

  // คำนวณคะแนน PSQI (Rule-Based)
  const computePSQI = () => {
    // เตรียมค่าที่ต้องใช้
    const tibMin = timeInBedMinutes(bedtime, wakeTime);
    const c1 = scoreC1(q6);
    const c2 = scoreC2(Number(sleepLatencyMin), q5.q51);
    const c3 = scoreC3(Number(sleepHours));
    const c4 = scoreC4(Number(sleepHours), tibMin);
    const c5 = scoreC5(q5);
    const c6 = scoreC6(q7);
    const c7 = scoreC7(q8, q9);

    const components = { c1, c2, c3, c4, c5, c6, c7 };

    if (Object.values(components).some((v) => v == null)) {
      return { error: "กรุณากรอกข้อมูลให้ครบถ้วนเพื่อคำนวณคะแนน PSQI" };
    }

    const global = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    const interpretation = interpretPSQI(global);
    const efficiency =
      tibMin && tibMin > 0 ? Math.round(((Number(sleepHours) * 60) / tibMin) * 100) : null;

    return {
      global,
      interpretation,
      components,
      extras: {
        timeInBedMin: tibMin,
        efficiencyPercent: efficiency, // ประสิทธิภาพการนอน %
      },
    };
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <header className="mb-6 space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 text-center">แบบประเมินคุณภาพการนอนหลับ</h1>
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Pittsburgh Sleep Quality Index (PSQI)
          </h2>
          <p className="text-gray-600 text-center">** โปรดตอบตามความเป็นจริง ครอบคลุมช่วง 1 เดือนที่ผ่านมา **</p>
        </header>

        {/* Q1 */}
        <TimeSelect
          label="1) ในช่วงระยะเวลา 1 เดือนที่ผ่านมาส่วนใหญ่ท่านมักเข้านอนเวลาใด"
          value={bedtime}
          onChange={setBedtime}
          required
        />

        {/* Q2 */}
        <NumberInput
          label="2) ส่วนใหญ่ท่านต้องใช้เวลากี่นาทีจึงจะนอนหลับ"
          value={String(sleepLatencyMin)}
          onChange={(v) => setSleepLatencyMin(v === "" ? "" : Number(v))}
          suffix="นาที"
          required
        />

        {/* Q3 */}
        <TimeSelect
          label="3) ส่วนใหญ่ท่านตื่นนอนตอนเช้าเวลาใด"
          value={wakeTime}
          onChange={setWakeTime}
          required
        />

        {/* Q4 */}
        <NumberInput
          label="4) ท่านนอนหลับได้จริงเป็นเวลากี่ชั่วโมงต่อคืน"
          value={String(sleepHours)}
          onChange={(v) => setSleepHours(v === "" ? "" : Number(v))}
          suffix="ชั่วโมง"
          required
        />

        {/* Q5 */}
        <div>
          <p className="mb-3 font-semibold text-gray-900">
            5. ปัญหาการนอนหลับต่อไปนี้เกิดขึ้นบ่อยเพียงใด
          </p>
          <div className="space-y-6">
            {Object.entries({
              q51: "5.1 นอนไม่หลับหลังจากเข้านอนแล้วนานกว่า 30 นาที",
              q52: "5.2 รู้สึกตัวตื่นขึ้นกลางดึก หรือตื่นเช้ากว่าเวลาที่ตั้งใจ",
              q53: "5.3 ตื่นเพื่อไปเข้าห้องน้ำ",
              q54: "5.4 หายใจไม่สะดวก",
              q55: "5.5 ไอหรือกรนเสียงดัง",
              q56: "5.6 รู้สึกหนาวเกินไป",
              q57: "5.7 รู้สึกร้อนเกินไป",
              q58: "5.8 ฝันร้าย",
              q59: "5.9 รู้สึกปวด",
              q510: "5.10 เหตุผลอื่นๆ ที่รบกวนการนอนหลับ",
            }).map(([key, label]) => (
              <div key={key}>
                <p className="mb-3 font-medium text-gray-900">{label}</p>
                <RadioGroup
                  name={key}
                  value={q5[key]}
                  onChange={(v) => handleQ5(key, Number(v))}
                  options={question578and10Item}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Q6 */}
        <div>
          <p className="mb-3 font-semibold text-gray-900">
            6. โดยรวมคิดว่าคุณภาพการนอนหลับของท่านเป็นอย่างไร
          </p>
          <RadioGroup name="q6" value={q6} onChange={setQ6} options={question6} />
        </div>

        {/* Q7 */}
        <div>
          <p className="mb-3 font-semibold text-gray-900">7. การใช้ยาช่วยการนอนหลับบ่อยเพียงใด</p>
          <RadioGroup
            name="q7"
            value={q7}
            onChange={(v) => setQ7(Number(v))}
            options={question578and10Item}
          />
        </div>

        {/* Q8 */}
        <div>
          <p className="mb-3 font-semibold text-gray-900">
            8. ง่วงหรือเผลอหลับระหว่างทำกิจกรรมบ่อยเพียงใด
          </p>
          <RadioGroup
            name="q8"
            value={q8}
            onChange={(v) => setQ8(Number(v))}
            options={question578and10Item}
          />
        </div>

        {/* Q9 */}
        <div>
          <p className="mb-3 font-semibold text-gray-900">
            9. ปัญหาเกี่ยวกับความกระตือรือร้นในการทำงานให้สำเร็จ
          </p>
          <RadioGroup name="q9" value={q9} onChange={(v) => setQ9(Number(v))} options={question9} />
        </div>

        {/* Q10 */}
        <div>
          <p className="mb-3 font-semibold text-gray-900">
            10. ท่านมีคู่นอน เพื่อนร่วมห้อง หรือผู้อาศัยอยู่ในบ้านหลังเดียวกันหรือไม่
          </p>
          <RadioGroup name="q10" value={q10} onChange={(v) => setQ10(Number(v))} options={question10} />
          {showQ10FollowUps && (
            <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
              <h4 className="mb-3 font-semibold text-indigo-800">
                กรุณาสอบถามบุคคลข้างต้นว่า ในช่วงระยะเวลา 1 เดือนที่ผ่านมาเกิดอาการต่อไปนี้หรือไม่
              </h4>
              <div className="space-y-6">
                {q10Items.map((it) => (
                  <div key={it.key}>
                    <p className="mb-3 font-medium text-gray-900">{it.label}</p>
                    <RadioGroup
                      name={it.key}
                      value={q10x[it.key]}
                      onChange={(v) => handleQ10x(it.key, Number(v))}
                      options={question578and10Item}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            onClick={() => {
              setBedtime("22:30");
              setSleepLatencyMin(15);
              setWakeTime("06:30");
              setSleepHours(7);
              setQ5({
                q51: null,
                q52: null,
                q53: null,
                q54: null,
                q55: null,
                q56: null,
                q57: null,
                q58: null,
                q59: null,
                q510: null,
              });
              setQ6("");
              setQ7(null);
              setQ8(null);
              setQ9(null);
              setQ10(null);
              setQ10x({ q101: null, q102: null, q103: null, q104: null, q105: null });
              setResult(null);
            }}
          >
            ล้างคำตอบ
          </button>
          <button
  type="button"
  className="rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
  onClick={async () => {
  const r = computePSQI();
  if (r?.error) {
    alert(r.error);
    setResult(null);
    return;
  }
  setResult(r);

  const payloadForDB = {
    user_id: getAuthUserIdOrNull(), // ถ้าไม่ได้ล็อกอิน => null
    bedtime,
    sleepLatencyMin,
    wakeTime,
    sleepHours,
    components: r.components,
    global: r.global,
    efficiencyPercent: r.extras?.efficiencyPercent ?? null,
    timeInBedMin: r.extras?.timeInBedMin ?? null,
  };

  try {
    const res = await fetch(`${API}/api/psqi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadForDB),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) throw new Error(data?.error || "บันทึกไม่สำเร็จ");
    alert(`บันทึกสำเร็จ! (id = ${data.id})`);
  } catch (err) {
    console.error(err);
    alert("บันทึกไม่สำเร็จ: " + err.message);
  }
}}

>
  ส่งคำตอบ
</button>

        </div>

        {/* ผล Rule-Based AI */}
        {result && !result.error && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-sm text-gray-600">คะแนนรวม PSQI (0–21)</p>
                <p className="text-3xl font-extrabold text-gray-900">
                  {result.global}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${result.interpretation?.color}`}>
                  {result.interpretation?.level}
                </p>
                <p className="text-gray-700">{result.interpretation?.hint}</p>
              </div>
            </div>

            <hr className="my-4" />

            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <p className="font-semibold">สรุปองค์ประกอบ (0–3)</p>
                <ul className="mt-2 space-y-1 text-gray-800">
                  <li>ช่วงที่ 1 ความพึงพอใจการนอน (C1): {result.components.c1}</li>
                  <li>ช่วงที่ 2 ระยะเวลาหลับ (C2): {result.components.c2}</li>
                  <li>ช่วงที่ 3 ชั่วโมงการนอน (C3): {result.components.c3}</li>
                  <li>ช่วงที่ 4 ประสิทธิภาพการนอน (C4): {result.components.c4}</li>
                  <li>ช่วงที่ 5 การถูกรบกวนการนอน (C5): {result.components.c5}</li>
                  <li>ช่วงที่ 6 การใช้ยานอนหลับ (C6): {result.components.c6}</li>
                  <li>ช่วงที่ 7 การทำงานกลางวัน (C7): {result.components.c7}</li>
                </ul>
              </div>

              <div className="rounded-xl bg-white p-3 shadow-sm">
                <p className="font-semibold">ตัวชี้วัดเพิ่มเติม</p>
                <ul className="mt-2 space-y-1 text-gray-800">
                  <li>
                    เวลาบนเตียง (Time in bed):{" "}
                    {result.extras.timeInBedMin} นาที
                  </li>
                  <li>
                    ประสิทธิภาพการนอน (Sleep Efficiency):{" "}
                    {result.extras.efficiencyPercent != null
                      ? `${result.extras.efficiencyPercent}%`
                      : "-"}
                  </li>
                  <li className="text-gray-600">
                    เกณฑ์มาตรฐาน: คะแนน &gt; 5 = เข้าข่ายคุณภาพการนอนแย่
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
