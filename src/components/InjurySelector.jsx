import { INJURY_TYPES, EXERCISES_BY_INJURY } from "../constants/exercises";

// ── Injury type picker ────────────────────────────────────────
function InjuryPicker({ injury, onChange }) {
  return (
    <div>
      <div style={lbl}>نوع الإصابة</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {Object.values(INJURY_TYPES).map((inj) => {
          const active = injury === inj.id;
          return (
            <button
              key={inj.id}
              onClick={() => onChange(inj.id)}
              style={{
                flex: "1 1 40%", padding: "8px 6px",
                background: active ? "#1e293b" : "#fff",
                color:      active ? "#fff"    : "#64748b",
                border: `1.5px solid ${active ? "#1e293b" : "#e2e8f0"}`,
                borderRadius: 10, fontFamily: "'Cairo',sans-serif",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                transition: "all .15s",
              }}
            >
              <span style={{ fontSize: 18 }}>{inj.icon}</span>
              {inj.nameAr}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Exercise picker (filtered by injury) ─────────────────────
function ExercisePicker({ injury, selected, onChange }) {
  const list = EXERCISES_BY_INJURY[injury] || [];
  return (
    <div>
      <div style={lbl}>التمرين</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {list.map((ex) => {
          const on = selected === ex.key;
          return (
            <button
              key={ex.key}
              onClick={() => onChange(ex)}
              style={{
                flex: "1 1 28%", padding: "10px 6px",
                background: on ? ex.color : "#fff",
                color:      on ? "#fff"   : "#64748b",
                border: `1.5px solid ${on ? ex.color : "#e2e8f0"}`,
                borderRadius: 12, fontFamily: "'Cairo',sans-serif",
                fontSize: 11, fontWeight: 700, cursor: "pointer",
                boxShadow: on ? `0 4px 12px ${ex.color}44` : "none",
                transition: "all .2s", textAlign: "center",
              }}
            >
              <div style={{ fontSize: 18, marginBottom: 3 }}>{ex.icon}</div>
              <div>{ex.nameAr}</div>
              <div style={{ fontSize: 10, opacity: .75, marginTop: 1 }}>{ex.target}°</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Combined selector ─────────────────────────────────────────
export default function InjurySelector({ injury, selectedExKey, onInjuryChange, onExerciseChange }) {
  return (
    <>
      <InjuryPicker injury={injury} onChange={(newInjury) => {
        // pick first exercise of new injury automatically
        const first = EXERCISES_BY_INJURY[newInjury]?.[0];
        onInjuryChange(newInjury);
        if (first) onExerciseChange(first);
      }} />
      <ExercisePicker
        injury={injury}
        selected={selectedExKey}
        onChange={onExerciseChange}
      />
    </>
  );
}

const lbl = {
  fontSize: 10, fontWeight: 700, letterSpacing: 2,
  textTransform: "uppercase", color: "#94a3b8", marginBottom: 8,
};
