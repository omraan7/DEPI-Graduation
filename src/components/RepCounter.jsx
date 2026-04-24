export default function RepCounter({ reps, targetReps, onTargetChange, ex }) {
  const pct = Math.min(100, (reps / targetReps) * 100);

  return (
    <div style={{
      background: "#fff", border: "1px solid #f1f5f9",
      borderRadius: 16, padding: "16px 18px",
    }}>
      <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>
        التكرارات
      </div>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{
          fontFamily: "'Cairo',sans-serif", fontSize: 56,
          fontWeight: 900, color: ex.color, lineHeight: 1,
        }}>{reps}</span>
        <span style={{ fontFamily: "'Cairo',sans-serif", fontSize: 26, color: "#cbd5e1" }}>/ {targetReps}</span>
      </div>

      {/* Mini progress */}
      <div style={{ height: 5, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: ex.color, borderRadius: 3, transition: "width .4s",
        }} />
      </div>

      {/* Target slider */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>الهدف</span>
        <input
          type="range" min="5" max="30" step="5" value={targetReps}
          onChange={(e) => onTargetChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: ex.color }}
        />
        <span style={{ fontSize: 13, fontWeight: 700, color: ex.color, minWidth: 24 }}>{targetReps}</span>
      </div>
    </div>
  );
}
