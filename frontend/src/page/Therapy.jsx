import { Link } from "react-router-dom";

export default function Therapy() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      {/* HERO */}
      <section className="bg-white/80 backdrop-blur rounded-2xl shadow-xl ring-1 ring-black/5 p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          การบำบัดอาการนอนไม่หลับแบบดิจิทัล (dCBT-I)
        </h1>
        <p className="mt-3 text-gray-600 md:text-lg">
          dCBT-I คือการประยุกต์หลัก <b>Cognitive Behavioral Therapy for Insomnia</b> ผ่านแพลตฟอร์มดิจิทัล
          ช่วยปรับทั้งพฤติกรรมและความคิดที่เกี่ยวข้องกับการนอน โดยติดตามผลด้วย <b>SleepDiary</b> และประเมินด้วยกฎ{" "}
          <b>Rule-Based AI</b> ของคุณ
        </p>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <StepCard
            no="1"
            title="การศึกษาโรค (Psychoeducation)"
            points={["เข้าใจวงจรการนอน", "เรียนรู้ปัจจัย 3P", "ตั้งความคาดหวังที่เหมาะสม"]}
          />
          <StepCard
            no="2"
            title="ควบคุมสิ่งเร้า (Stimulus Control)"
            points={[
              "เตียง = นอน/มีเพศสัมพันธ์เท่านั้น",
              "ง่วงค่อยขึ้นเตียง หาก 15–20 นาทีไม่หลับให้ลุกไปทำกิจกรรมผ่อนคลาย",
              "ตื่นเวลาเดิมทุกวัน",
            ]}
          />
          <StepCard
            no="3"
            title="จำกัดเวลาอยู่บนเตียง (Sleep Restriction)"
            points={[
              "กำหนดเวลาบนเตียงตามชั่วโมงนอนจริง",
              "ค่อย ๆ เพิ่มเวลาเมื่อประสิทธิภาพการนอน > 85%",
              "ติดตามด้วย SleepDiary ทุกวัน",
            ]}
          />
          <StepCard
            no="4"
            title="ปรับความคิด (Cognitive)"
            points={[
              "ท้าทายความเชื่อ ‘ต้องหลับทันที’",
              "ปรับกรอบคิดต่อการตื่นกลางดึก",
              "ฝึกผ่อนคลาย/หายใจช้า",
            ]}
          />
          <StepCard
            no="5"
            title="สุขอนามัยการนอน"
            points={[
              "จัดสิ่งแวดล้อมเหมาะสม",
              "เลี่ยงคาเฟอีน/แอลกอฮอล์ใกล้เข้านอน",
              "ลดหน้าจอแสงสีน้ำเงินก่อนนอน",
            ]}
          />
          <StepCard
            no="6"
            title="ติดตาม-ปรับแผน"
            points={[
              "ดูกราฟรายสัปดาห์/เดือน",
              "ใช้ Rule-Based AI สรุปหนี้การนอนและความสม่ำเสมอ",
              "ปรับเวลาเข้านอน-ตื่นให้คงเส้นคงวา",
            ]}
          />
        </div>

        {/* Example Goals */}
        <div className="mt-6 rounded-xl border bg-white p-4">
          <h3 className="font-bold text-gray-900">ตัวอย่างเป้าหมายเบื้องต้น</h3>
          <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
            <li>เวลาตื่นยึดคงที่ทุกวัน (เช่น 06:30) เป็นอันดับแรก</li>
            <li>เพิ่มประสิทธิภาพการนอน (Sleep Efficiency) ≥ 85%</li>
            <li>ลดส่วนเบี่ยงเบนของจุดกึ่งกลางการนอน (mid-sleep SD) ให้ ≤ 60 นาที ภายใน 4 สัปดาห์</li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/sleep" className="btn-primary">
            เริ่มบันทึก SleepDiary
          </Link>
          <Link to="/psqi" className="btn-ghost">
            ทำแบบประเมิน PSQI
          </Link>
          <Link to="/inform" className="btn-link">
            กลับไปอ่านความรู้
          </Link>
        </div>
      </section>

      {/* Tips & Safety */}
      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
          <h3 className="text-lg font-bold text-gray-900">เคล็ดลับการเริ่ม dCBT-I ให้เวิร์ก</h3>
          <ul className="mt-2 grid gap-1 text-gray-700 list-disc list-inside">
            <li>
              ตั้งเวลาตื่น <b>คงที่</b> แล้วค่อยปรับเวลาเข้านอนตามความง่วง
            </li>
            <li>ง่วงค่อยขึ้นเตียง หากไม่หลับให้เปลี่ยนที่ทำกิจกรรมผ่อนคลาย</li>
            <li>บันทึกไดอารี่นอนทุกวันเพื่อดูแนวโน้มจริง ไม่คาดเดา</li>
          </ul>
        </article>
        <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
          <h3 className="text-lg font-bold text-gray-900">ข้อควรระวัง</h3>
          <p className="mt-1 text-gray-700 text-sm">
            หากมีอาการง่วงมากผิดปกติระหว่างวัน เสี่ยงต่อความปลอดภัย หรือสงสัยภาวะหยุดหายใจขณะหลับ/สุขภาพจิตอื่น ๆ
            ควรปรึกษาแพทย์ผู้เชี่ยวชาญเพื่อประเมินเพิ่มเติมก่อนทำโปรแกรมเข้มข้น
          </p>
        </article>
      </section>

      {/* Include Tailwind Button Classes */}
      <ButtonsCSS />
    </main>
  );
}

function StepCard({ no, title, points }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center gap-2 text-indigo-700 font-bold">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50">{no}</span> {title}
      </div>
      <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
        {points.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

// ===== Shared minimal button styles =====
export function ButtonsCSS() {
  return (
    <style>
      {`
        .btn-primary {
          @apply inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white px-4 py-2 font-semibold shadow-sm hover:bg-indigo-700 active:scale-[0.99] transition;
        }
        .btn-ghost {
          @apply inline-flex items-center justify-center rounded-xl border px-4 py-2 font-medium hover:bg-gray-50;
        }
        .btn-outline {
          @apply inline-flex items-center justify-center rounded-xl border border-indigo-300 text-indigo-700 bg-white px-4 py-2 font-medium hover:bg-indigo-50;
        }
        .btn-link {
          @apply inline-flex items-center text-indigo-700 hover:underline;
        }
      `}
    </style>
  );
}
