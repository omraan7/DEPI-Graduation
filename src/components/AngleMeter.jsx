export default function AngleMeter({ angle, ex }) {
  const val     = angle ?? 0;
  const reached = val >= ex.target * 0.9;
  const pct     = Math.min(100, Math.round((val / ex.target) * 100));
  const color   = reached ? "#16a34a" : val > ex.target * 0.55 ? ex.color : "#94a3b8";

  return (
    <div style={{
      background: "#fff",
      border: `2px solid ${reached ? "#16a34a" : "#f1f5f9"}`,
      borderRadius: 16, padding: "18px 20px", textAlign: "center",
      boxShadow: reached ? "0 0 0 4px #dcfce7" : "none",
      transition: "border-color .3s, box-shadow .3s",
    }}>
      <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
        زاوية {ex.nameAr}
      </div>

      {/* Big number */}
      <div style={{
        fontFamily: "'Cairo',sans-serif", fontSize: 76,
        fontWeight: 900, lineHeight: 1, color,
        transition: "color .3s",
      }}>
        {angle ?? "--"}
        <span style={{ fontSize: 32, fontWeight: 400 }}>°</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden", margin: "14px 0 6px" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: reached ? "#16a34a" : ex.color,
          borderRadius: 4, transition: "width .3s, background .3s",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8" }}>
        <span>0°</span>
        <span style={{ color, fontWeight: 700 }}>{pct}%</span>
        <span>{ex.target}°</span>
      </div>

      {reached && (
        <div style={{
          marginTop: 10, background: "#dcfce7", color: "#16a34a",
          borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 700,
        }}>✅ وصلت للهدف!</div>
      )}
    </div>
  );
}
