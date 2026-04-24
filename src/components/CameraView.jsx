export default function CameraView({
  videoRef, canvasRef,
  tracking, running,
  angle, ex, side,
  onStart, celebrating,
}) {
  const val     = angle ?? 0;
  const reached = val >= ex.target * 0.9;
  const textColor = reached
    ? "#4ade80"
    : val > ex.target * 0.55 ? "#fde68a" : "#fff";

  return (
    <div style={{
      position: "relative", background: "#0f172a",
      width: "100%", height: "100%", overflow: "hidden",
    }}>
      {/* ── No camera state ── */}
      {!tracking && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 20,
          background: "#f8fafc",
        }}>
          <div style={{ fontSize: 72, opacity: .12 }}>📷</div>
          <div style={{ fontSize: 17, color: "#94a3b8", fontFamily: "'Cairo',sans-serif" }}>
            اضغط ابدأ لتشغيل الكاميرا
          </div>
          <button onClick={onStart} style={{
            background: ex.color, color: "#fff", border: "none",
            borderRadius: 14, padding: "13px 36px",
            fontFamily: "'Cairo',sans-serif", fontSize: 16, fontWeight: 700,
            cursor: "pointer",
          }}>ابدأ التتبع</button>
        </div>
      )}

      {/* ── Video + Canvas ── */}
      <video ref={videoRef} playsInline autoPlay muted style={{
        width: "100%", height: "100%", objectFit: "cover",
        transform: "scaleX(-1)", display: tracking ? "block" : "none",
      }} />
      <canvas ref={canvasRef} style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        transform: "scaleX(-1)", display: tracking ? "block" : "none",
      }} />

      {/* ── Overlay when tracking ── */}
      {tracking && (
        <>
          {/* Status bar */}
          <div style={{
            position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
            borderRadius: 30, padding: "7px 20px",
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: "'Cairo',sans-serif", fontSize: 13, color: "#1e293b",
            boxShadow: "0 2px 14px rgba(0,0,0,0.1)",
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: running ? "#22c55e" : "#f59e0b",
            }} />
            <span>{ex.nameAr}</span>
            <span style={{ color: "#cbd5e1" }}>|</span>
            <span>{side === "left" ? "كتف يسار" : "كتف يمين"}</span>
            <span style={{ color: "#cbd5e1" }}>|</span>
            <span>هدف {ex.target}°</span>
          </div>

          {/* Big angle display */}
          <div style={{
            position: "absolute", bottom: 28, left: "50%",
            transform: "translateX(-50%)", textAlign: "center", pointerEvents: "none",
          }}>
            <div style={{
              fontFamily: "'Cairo',sans-serif", fontSize: 100, fontWeight: 900, lineHeight: 1,
              color: textColor, textShadow: "0 2px 16px rgba(0,0,0,0.6)",
              transition: "color .3s",
            }}>
              {angle ?? "--"}<span style={{ fontSize: 44 }}>°</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: 2 }}>
              زاوية {ex.nameAr}
            </div>
            {reached && (
              <div style={{
                marginTop: 8, background: "#16a34a", color: "#fff",
                borderRadius: 20, padding: "6px 22px",
                fontSize: 14, fontWeight: 700, fontFamily: "'Cairo',sans-serif",
              }}>✅ وصلت للهدف!</div>
            )}
          </div>

          {/* Celebration overlay */}
          {celebrating && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                fontFamily: "'Cairo',sans-serif", fontSize: 40, fontWeight: 900,
                color: "#fff", textShadow: "0 0 40px #22c55e",
              }}>🎯 أتممت الجلسة!</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
