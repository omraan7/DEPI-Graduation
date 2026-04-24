import { useRef, useEffect } from "react";

export default function MovementLog({ log }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [log]);

  return (
    <div style={{
      background: "#fff", border: "1px solid #f1f5f9",
      borderRadius: 16, overflow: "hidden",
      flex: 1, display: "flex", flexDirection: "column",
      minHeight: 0,
    }}>
      <div style={{
        padding: "10px 16px", borderBottom: "1px solid #f1f5f9",
        fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: 2,
      }}>
        سجل الحركات
      </div>

      <div style={{ overflowY: "auto", flex: 1, padding: "8px 0" }}>
        {log.length === 0 ? (
          <div style={{ padding: "24px 16px", textAlign: "center", color: "#cbd5e1", fontSize: 13 }}>
            ابدأ التمرين لتسجيل الحركات
          </div>
        ) : (
          log.map((entry, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 14px",
              borderBottom: i < log.length - 1 ? "1px solid #f8fafc" : "none",
              background: i % 2 === 0 ? "#fff" : "#fafafa",
            }}>
              {/* rep badge */}
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: (entry.ex.color || "#64748b") + "18",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: entry.ex.color || "#64748b",
                flexShrink: 0,
              }}>{entry.repNum}</div>

              {/* info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 600 }}>
                  {entry.ex.nameAr} — {entry.side === "left" ? "يسار" : "يمين"}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{entry.time}</div>
              </div>

              {/* peak angle */}
              <div style={{
                background: (entry.ex.color || "#64748b") + "15",
                color: entry.ex.color || "#64748b",
                borderRadius: 8, padding: "3px 10px",
                fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>↑ {entry.peakAngle}°</div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
