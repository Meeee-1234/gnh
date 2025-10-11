import { Link } from "react-router-dom";
import { useState } from "react";

export default function InformPage() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      {/* HERO */}
      <section className="bg-white/80 backdrop-blur rounded-2xl shadow-xl ring-1 ring-black/5 p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          รู้จัก “ภาวะนอนไม่หลับ” (Insomnia)
        </h1>
        <p className="mt-3 text-gray-600 md:text-lg">
          ภาวะนอนไม่หลับคือการนอนที่ <b>หลับยาก</b>, <b>ตื่นกลางดึกแล้วหลับต่อยาก</b>, หรือ <b>ตื่นเช้าเกินไป</b>{" "}
          ติดต่อกันจนส่งผลกับชีวิตกลางวัน เช่น ง่วง เหนื่อย สมาธิลดลง ฯลฯ
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <InfoCard
            title="อาการพบบ่อย"
            items={["หลับช้า > 30 นาที", "ตื่นกลางดึกบ่อย", "ตื่นเช้ากว่าที่ตั้งใจ", "รู้สึกว่านอนไม่พอ"]}
          />
          <InfoCard
            title="สาเหตุที่เกี่ยวข้อง"
            items={["ความเครียด/กังวล", "พฤติกรรมก่อนนอนไม่เหมาะสม", "แสงหน้าจอ/คาเฟอีน", "ตารางเวลานอนไม่นิ่ง"]}
          />
          <InfoCard
            title="ผลกระทบ"
            items={["ง่วง/อ่อนล้า", "ประสิทธิภาพลดลง", "อารมณ์แปรปรวน", "คุณภาพชีวิตลดลง"]}
          />
        </div>
      </section>

      {/* EDUCATION SECTIONS */}
      <section className="mt-10 grid gap-6">
        <ArticleSection
          heading="สุขอนามัยการนอน (Sleep Hygiene) แบบย่อ"
          bullets={[
            { k: "เวลา", v: "ตื่นเวลาเดิมทุกวัน แม้วันหยุด" },
            { k: "สิ่งแวดล้อม", v: "ห้องมืด เงียบ เย็นสบาย" },
            { k: "สารกระตุ้น", v: "เลี่ยงคาเฟอีน/นิโคตินช่วงบ่าย-เย็น" },
            { k: "หน้าจอ", v: "ลดแสงหน้าจออย่างน้อย 1 ชั่วโมงก่อนนอน" },
            { k: "ออกกำลัง", v: "สม่ำเสมอ แต่ไม่หนักใกล้เข้านอน" },
          ]}
        />

        <ArticleSection
          heading="เมื่อไรควรพบผู้เชี่ยวชาญ?"
          bullets={[
            { k: "เรื้อรัง", v: "อาการนาน ≥ 3 เดือน และกระทบชีวิตประจำวัน" },
            { k: "โรคร่วม", v: "สงสัยหยุดหายใจขณะหลับ ซึมเศร้า วิตกกังวล ฯลฯ" },
            { k: "ความปลอดภัย", v: "ง่วงจนเสี่ยงอุบัติเหตุ หรือใช้ยานอนหลับต่อเนื่องเอง" },
          ]}
        />
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-xl md:text-2xl font-bold">คำถามที่พบบ่อย</h2>
        <div className="mt-4 grid gap-3">
          <FAQ
            q="นอนไม่พอแค่ไหนถึงเรียกว่านอนไม่หลับ?"
            a="ไม่กำหนดชั่วโมงแน่นอน ดูคุณภาพการนอนและผลกระทบกลางวัน ถ้าบ่อยและรบกวนชีวิต ควรประเมินเพิ่มเติม"
          />
          <FAQ
            q="งีบได้ไหม?"
            a="งีบสั้น 10–20 นาที ก่อนบ่ายสามอาจช่วยได้ แต่การงีบเย็นหรือยาวทำให้หลับยากตอนกลางคืน"
          />
          <FAQ
            q="ดื่มกาแฟได้หรือไม่?"
            a="เลี่ยงคาเฟอีนหลังเที่ยง โดยเฉพาะบ่าย-เย็น เพราะครึ่งชีวิตคาเฟอีนยาวหลายชั่วโมง"
          />
        </div>
      </section>

      <Callout />
    </main>
  );
}

function InfoCard({ title, items }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="font-bold text-gray-900">{title}</h3>
      <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

function ArticleSection({ heading, bullets }) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
      <h3 className="text-lg font-bold text-gray-900">{heading}</h3>
      <ul className="mt-2 grid gap-1 text-gray-700">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="min-w-28 font-medium text-gray-900">{b.k}:</span>
            <span>{b.v}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-3 flex items-center justify-between"
      >
        <span className="font-medium text-gray-900">{q}</span>
        <span className="text-gray-400">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-4 pb-4 text-gray-600 text-sm">{a}</div>}
    </div>
  );
}

function Callout() {
  return (
    <div className="mt-10 rounded-2xl bg-white/80 backdrop-blur p-6 ring-1 ring-indigo-200 text-indigo-900">
      <p className="text-sm">
        ต้องการต่อยอด? ไปที่หน้า{" "}
        <Link to="/psqi" className="underline font-medium">
          PSQI
        </Link>{" "}
        เพื่อคัดกรอง และใช้{" "}
        <Link to="/sleep" className="underline font-medium">
          SleepDiary
        </Link>{" "}
        เพื่อติดตามผล จากนั้นระบบ <b>Rule-Based AI</b> จะช่วยประเมินความสม่ำเสมอ/หนี้การนอน
      </p>
    </div>
  );
}
