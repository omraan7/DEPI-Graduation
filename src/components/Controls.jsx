export default function Controls({ tracking, running, ex, onToggle, onReset, onStop }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <button
        onClick={onToggle}
        style={{
          gridColumn: "1 / -1",
          background: ex.color, color: "#fff", border: "none",
          borderRadius: 12, padding: "13px",
          fontFamily: "'Cairo',sans-serif", fontSize: 15, fontWeight: 700,
          cursor: "pointer", boxShadow: `0 4px 16px ${ex.color}44`,
        }}
      >
        {!tracking ? "▶ ابدأ الجلسة" : running ? "⏸ وقف مؤقت" : "▶ استكمال"}
      </button>

      <button
        onClick={onReset}
        style={{
          background: "#f8fafc", color: "#475569",
          border: "1px solid #e2e8f0", borderRadius: 12, padding: "11px",
          fontFamily: "'Cairo',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}
      >🔄 ريست</button>

      <button
        onClick={onStop}
        style={{
          background: "#fff5f5", color: "#ef4444",
          border: "1px solid #fecaca", borderRadius: 12, padding: "11px",
          fontFamily: "'Cairo',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}
      >⏹ إيقاف</button>
    </div>
  );
}
