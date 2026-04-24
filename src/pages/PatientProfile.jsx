import { EXERCISES_BY_INJURY } from "../constants/exercises";

const INJURY_NAMES = {
  shoulder: "الكتف", knee: "الركبة", neck: "الرقبة", back: "الظهر",
};

export default function PatientProfile({ patient, sessionLog, onStartExercise, onBack }) {
  const injuryName = patient?.injury ? INJURY_NAMES[patient.injury] : "—";
  const exercises  = patient?.injury ? (EXERCISES_BY_INJURY[patient.injury] || []) : [];
  const totalReps  = sessionLog.reduce((s, e) => s + (e.repNum || 0), 0);
  const sessions   = sessionLog.length;
  const maxAngle   = sessionLog.length > 0
    ? Math.max(...sessionLog.map(e => e.peakAngle || 0))
    : 0;

  return (
    <div style={{
      minHeight: "100vh", background: "#f8fafc",
      fontFamily: "'Cairo',sans-serif", direction: "rtl",
      paddingBottom: 80,
    }}>
      {/* Header */}
      <div style={{
        background: "#c4dafc", padding: "16px 20px",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        {onBack && (
          <button onClick={onBack} style={{
            background: "rgba(255,255,255,.6)", border: "none", borderRadius: 10,
            padding: "7px 14px", cursor: "pointer",
            fontFamily: "'Cairo',sans-serif", fontSize: 13, color: "#1e293b",
          }}>← رجوع</button>
        )}
        <div style={{ fontWeight: 700, fontSize: 16, color: "#1e293b" }}>بروفايلي</div>
      </div>

      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Avatar card */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "20px",
          border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "#c4dafc",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700, color: "#1e293b", flexShrink: 0,
          }}>{patient?.avatar || "؟"}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#1e293b" }}>{patient?.name || "المريض"}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
              {patient?.age ? `${patient.age} سنة` : ""} {patient?.phone ? `· ${patient.phone}` : ""}
            </div>
            <div style={{ marginTop: 6 }}>
              {patient?.injury
                ? <span style={{ background: "#eff6ff", color: "#2563eb", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>🦴 إصابة {injuryName}</span>
                : <span style={{ background: "#f1f5f9", color: "#94a3b8", borderRadius: 20, padding: "3px 12px", fontSize: 12 }}>لا توجد إصابة محددة</span>
              }
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {[
            ["🔥", "عدات", totalReps],
            ["📅", "جلسات", sessions],
            ["📐", "أقصى زاوية", maxAngle + "°"],
          ].map(([ic, lbl, val]) => (
            <div key={lbl} style={{
              background: "#fff", borderRadius: 14, padding: "14px 10px",
              textAlign: "center", border: "1px solid #f1f5f9",
            }}>
              <div style={{ fontSize: 22 }}>{ic}</div>
              <div style={{ fontWeight: 900, fontSize: 22, color: "#1e293b", lineHeight: 1.2 }}>{val}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Exercises assigned */}
        {exercises.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 2, marginBottom: 12 }}>
              تمارين مقررة
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {exercises.map(ex => (
                <div key={ex.key} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 12,
                  background: "#f8fafc", border: "1px solid #f1f5f9",
                }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{ex.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{ex.nameAr}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{ex.descAr}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ background: ex.color + "18", color: ex.color, borderRadius: 8, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{ex.target}°</span>
                  </div>
                  <button onClick={() => onStartExercise(ex)} style={{
                    background: ex.color, color: "#fff", border: "none",
                    borderRadius: 10, padding: "7px 12px",
                    fontFamily: "'Cairo',sans-serif", fontSize: 12, fontWeight: 700,
                    cursor: "pointer",
                  }}>ابدأ</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session history */}
        {sessionLog.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 2 }}>
              سجل الجلسات
            </div>
            {sessionLog.slice().reverse().map((entry, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px",
                borderBottom: i < sessionLog.length - 1 ? "1px solid #f8fafc" : "none",
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: (entry.ex?.color || "#64748b") + "15",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: entry.ex?.color || "#64748b",
                }}>{entry.repNum}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{entry.ex?.nameAr}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{entry.time}</div>
                </div>
                <span style={{
                  background: (entry.ex?.color || "#64748b") + "15",
                  color: entry.ex?.color || "#64748b",
                  borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700,
                }}>↑ {entry.peakAngle}°</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
