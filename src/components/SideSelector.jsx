const btnBase = {
  flex: 1, padding: "9px 0",
  borderRadius: 10, fontFamily: "'Cairo',sans-serif",
  fontSize: 13, fontWeight: 700, cursor: "pointer",
  border: "1.5px solid #000",
};

export default function SideSelector({ side, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[["left", "◀ يسار"], ["right", "يمين ▶"]].map(([s, lbl]) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          style={{
            ...btnBase,
            background: side === s ? "#1e293b" : "#fff",
            color:      side === s ? "#fff"    : "#64748b",
          }}
        >
          {lbl}
        </button>
      ))}
    </div>
  );
}
