const INJURY_NAMES = {
  shoulder: "الكتف", knee: "الركبة", neck: "الرقبة", back: "الظهر",
};

export default function HomePage({ patient, doctor, sessionLog, onStartChat, onGoToTracker, onGoToMessages }) {
  const totalReps = sessionLog.reduce((s, e) => s + 1, 0);
  const lastSession = sessionLog[sessionLog.length - 1];

  return (
    <div style={{
      minHeight: "100vh", background: "#f8fafc",
      fontFamily: "'Cairo',sans-serif", direction: "rtl",
      paddingBottom: 80,
    }}>
      {/* Header */}
      <div style={{ background: "#c4dafc", padding: "20px 20px 28px" }}>
        <div style={{ fontSize: 13, color: "#334155", opacity: .7 }}>
          {new Date().toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" })}
        </div>
        <div style={{ fontWeight: 900, fontSize: 22, color: "#1e293b", marginTop: 4 }}>
          أهلاً بك 👋
        </div>
        <div style={{ fontSize: 14, color: "#334155", marginTop: 4, opacity: .8 }}>
          {patient?.injury
            ? `إصابة ${INJURY_NAMES[patient.injury]} · ابدأ جلستك اليوم`
            : "كلم عمران لتحديد إصابتك"
          }
        </div>
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14, marginTop: -12 }}>

        {/* Main CTA */}
        {!patient?.injury ? (
          <div style={{
            background: "#fff", borderRadius: 20, padding: "24px 20px",
            border: "1px solid #f1f5f9", textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,.06)",
          }}>
            <div style={{ fontSize: 48 }}>🤖</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#1e293b", marginTop: 12 }}>
              ابدأ مع عمران
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 6, lineHeight: 1.6 }}>
              احكي لعمران عن ألمك وهيرشحلك أنسب دكتور وتمارين
            </div>
            <button onClick={onStartChat} style={{
              marginTop: 16, background: "#1e293b", color: "#fff",
              border: "none", borderRadius: 12, padding: "13px 32px",
              fontFamily: "'Cairo',sans-serif", fontSize: 15, fontWeight: 700,
              cursor: "pointer", width: "100%",
            }}>💬 ابدأ المحادثة</button>
          </div>
        ) : (
          <div style={{
            background: "#1e293b", borderRadius: 20, padding: "20px",
            cursor: "pointer",
          }} onClick={onGoToTracker}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>استمر من حيث توقفت</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#fff", marginTop: 6 }}>
              ابدأ جلسة تمارين 🏋️
            </div>
            <div style={{ fontSize: 13, color: "#c4dafc", marginTop: 4 }}>
              إصابة {INJURY_NAMES[patient.injury]} · اضغط للدخول
            </div>
            <div style={{
              marginTop: 14, height: 4, background: "rgba(255,255,255,.15)", borderRadius: 2, overflow: "hidden",
            }}>
              <div style={{
                width: `${Math.min(100, (totalReps / 50) * 100)}%`,
                height: "100%", background: "#c4dafc", borderRadius: 2,
              }}/>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 6 }}>
              {totalReps} عدة إجمالاً
            </div>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 22 }}>🔥</div>
            <div style={{ fontWeight: 900, fontSize: 28, color: "#1e293b", lineHeight: 1.2, marginTop: 6 }}>
              {sessionLog.length}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>جلسة مكتملة</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 22 }}>📐</div>
            <div style={{ fontWeight: 900, fontSize: 28, color: "#1e293b", lineHeight: 1.2, marginTop: 6 }}>
              {sessionLog.length > 0 ? Math.max(...sessionLog.map(e => e.peakAngle || 0)) : "—"}
              {sessionLog.length > 0 ? "°" : ""}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>أقصى زاوية</div>
          </div>
        </div>

        {/* Doctor card */}
        {doctor && (
          <div style={{
            background: "#fff", borderRadius: 16, padding: "16px",
            border: "1px solid #f1f5f9",
            borderRight: `4px solid ${doctor.color}`,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 2, marginBottom: 12 }}>
              دكتورك المعالج
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: doctor.color + "18",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 700, color: doctor.color, flexShrink: 0,
              }}>{doctor.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{doctor.name}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{doctor.specialty}</div>
              </div>
              <button onClick={onGoToMessages} style={{
                background: doctor.color, color: "#fff", border: "none",
                borderRadius: 10, padding: "8px 14px",
                fontFamily: "'Cairo',sans-serif", fontSize: 12, fontWeight: 700,
                cursor: "pointer",
              }}>💬 رسالة</button>
            </div>
          </div>
        )}

        {/* Last session */}
        {lastSession && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 2, marginBottom: 10 }}>
              آخر جلسة
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>{lastSession.ex?.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{lastSession.ex?.nameAr}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{lastSession.time}</div>
              </div>
              <span style={{
                background: (lastSession.ex?.color || "#64748b") + "15",
                color: lastSession.ex?.color || "#64748b",
                borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700,
              }}>↑ {lastSession.peakAngle}°</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
