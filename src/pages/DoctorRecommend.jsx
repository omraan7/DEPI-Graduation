import { MOCK_DOCTORS } from "../data/mockData";

const INJURY_NAMES = {
  shoulder: "الكتف", knee: "الركبة", neck: "الرقبة", back: "الظهر",
};

function Stars({ rating }) {
  return (
    <span style={{ fontSize: 12, color: "#f59e0b", letterSpacing: 1 }}>
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
    </span>
  );
}

function DoctorCard({ doctor, onSelect }) {
  return (
    <div onClick={() => onSelect(doctor)} style={{
      background: "#fff", border: "1px solid #f1f5f9",
      borderRadius: 16, padding: "18px 16px",
      cursor: "pointer", transition: "all .15s",
      borderRight: `4px solid ${doctor.color}`,
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.08)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {/* Avatar */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: doctor.color + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, color: doctor.color, flexShrink: 0,
        }}>{doctor.avatar}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{doctor.name}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{doctor.specialty}</div>
            </div>
            <div style={{ textAlign: "left", flexShrink: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{doctor.price} جنيه</div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>/ جلسة</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 8 }}>
            <Stars rating={doctor.rating} />
            <span style={{ fontSize: 11, color: "#64748b" }}>{doctor.rating} ({doctor.reviews})</span>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "#64748b" }}>📍 {doctor.location}</span>
            <span style={{ fontSize: 11, color: "#64748b" }}>🕒 خبرة {doctor.experience} سنوات</span>
          </div>

          <div style={{
            marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
              background: doctor.available ? "#dcfce7" : "#f1f5f9",
              color: doctor.available ? "#16a34a" : "#94a3b8",
            }}>
              {doctor.available ? "🟢 متاح" : "🔴 مشغول"}
            </span>
            <span style={{ fontSize: 11, color: "#64748b" }}>أقرب موعد: {doctor.nextSlot}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorRecommend({ injury, onSelectDoctor, onBack }) {
  const filtered = MOCK_DOCTORS.filter(d => d.injuries.includes(injury));
  const injuryName = INJURY_NAMES[injury] || injury;

  return (
    <div style={{
      minHeight: "100vh", background: "#f8fafc",
      fontFamily: "'Cairo',sans-serif", direction: "rtl",
      paddingBottom: 80,
    }}>
      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #f1f5f9",
        padding: "16px 20px", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{
            background: "#f1f5f9", border: "none", borderRadius: 10,
            padding: "7px 14px", cursor: "pointer",
            fontFamily: "'Cairo',sans-serif", fontSize: 13, color: "#64748b",
          }}>← رجوع</button>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>
              دكاترة متخصصين في إصابة {injuryName}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{filtered.length} دكتور متاح</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Info banner */}
        <div style={{
          background: "#eff6ff", border: "1px solid #bfdbfe",
          borderRadius: 12, padding: "12px 16px",
          fontSize: 13, color: "#1d4ed8",
        }}>
          💡 الدكاترة دول متخصصين في إصابات {injuryName} واتم ترشيحهم بناءً على وصفك للألم
        </div>

        {filtered.map(d => (
          <DoctorCard key={d.id} doctor={d} onSelect={onSelectDoctor} />
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div>مفيش دكاترة متاحين حالياً لهذه الإصابة</div>
          </div>
        )}
      </div>
    </div>
  );
}
