import { useState } from "react";

const TIME_SLOTS = [
  "9:00 ص", "10:00 ص", "11:00 ص",
  "1:00 م", "2:00 م", "3:00 م",
  "5:00 م", "6:00 م", "7:00 م",
];

function Stars({ rating }) {
  return (
    <span style={{ fontSize: 14, color: "#f59e0b", letterSpacing: 1 }}>
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
    </span>
  );
}

export default function DoctorProfile({ doctor, onBook, onMessage, onBack }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [note, setNote] = useState("");
  const [booked, setBooked] = useState(false);

  function handleBook() {
    if (!selectedSlot) return;
    setBooked(true);
    setTimeout(() => onBook(doctor, selectedSlot, note), 1500);
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#f8fafc",
      fontFamily: "'Cairo',sans-serif", direction: "rtl",
      paddingBottom: 100,
    }}>
      {/* Header */}
      <div style={{
        background: doctor.color, padding: "20px 20px 60px",
        position: "relative",
      }}>
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,.2)", border: "none",
          borderRadius: 10, padding: "7px 14px", cursor: "pointer",
          color: "#fff", fontSize: 13, fontFamily: "'Cairo',sans-serif",
        }}>← رجوع</button>
      </div>

      {/* Avatar card (overlapping) */}
      <div style={{
        background: "#fff", margin: "0 16px",
        borderRadius: 20, padding: "20px",
        marginTop: -40, position: "relative",
        boxShadow: "0 4px 24px rgba(0,0,0,.10)",
        border: "1px solid #f1f5f9",
      }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: doctor.color + "20",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 700, color: doctor.color,
            border: `3px solid ${doctor.color}30`, flexShrink: 0,
          }}>{doctor.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#1e293b" }}>{doctor.name}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{doctor.specialty}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
              <Stars rating={doctor.rating} />
              <span style={{ fontSize: 12, color: "#64748b" }}>{doctor.rating} ({doctor.reviews} تقييم)</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 16 }}>
          {[
            ["🏅", "خبرة", `${doctor.experience} سنة`],
            ["👥", "جلسات", `${doctor.sessions}+`],
            ["💰", "السعر", `${doctor.price} ج`],
          ].map(([ic, lbl, val]) => (
            <div key={lbl} style={{
              background: "#f8fafc", borderRadius: 12,
              padding: "10px", textAlign: "center",
            }}>
              <div style={{ fontSize: 18 }}>{ic}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{lbl}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b" }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Bio */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 2, marginBottom: 8 }}>
            نبذة عن الدكتور
          </div>
          <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, margin: 0 }}>{doctor.bio}</p>
        </div>

        {/* Booking */}
        {!booked ? (
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 2, marginBottom: 12 }}>
              اختر موعد الجلسة
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TIME_SLOTS.map(slot => (
                <button key={slot} onClick={() => setSelectedSlot(slot)} style={{
                  padding: "8px 14px", borderRadius: 20,
                  border: `1.5px solid ${selectedSlot === slot ? doctor.color : "#e2e8f0"}`,
                  background: selectedSlot === slot ? doctor.color : "#fff",
                  color: selectedSlot === slot ? "#fff" : "#334155",
                  fontSize: 13, cursor: "pointer", fontFamily: "'Cairo',sans-serif",
                  fontWeight: selectedSlot === slot ? 700 : 400,
                }}>{slot}</button>
              ))}
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 2, marginBottom: 8 }}>
                رسالة للدكتور (اختياري)
              </div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="اكتب وصف مختصر لحالتك..."
                rows={3}
                style={{
                  width: "100%", border: "1px solid #e2e8f0", borderRadius: 12,
                  padding: "10px 14px", fontFamily: "'Cairo',sans-serif",
                  fontSize: 14, resize: "none", outline: "none", color: "#1e293b",
                }}
              />
            </div>

            <button
              onClick={handleBook}
              disabled={!selectedSlot}
              style={{
                width: "100%", marginTop: 14,
                background: selectedSlot ? doctor.color : "#e2e8f0",
                color: selectedSlot ? "#fff" : "#94a3b8",
                border: "none", borderRadius: 12, padding: "14px",
                fontFamily: "'Cairo',sans-serif", fontSize: 15, fontWeight: 700,
                cursor: selectedSlot ? "pointer" : "default",
                transition: "all .2s",
              }}
            >
              📅 احجز موعد {selectedSlot ? `— ${selectedSlot}` : ""}
            </button>
          </div>
        ) : (
          <div style={{
            background: "#dcfce7", border: "1px solid #86efac",
            borderRadius: 16, padding: "24px", textAlign: "center",
          }}>
            <div style={{ fontSize: 40 }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#16a34a", marginTop: 8 }}>
              تم الحجز بنجاح!
            </div>
            <div style={{ fontSize: 13, color: "#15803d", marginTop: 4 }}>
              موعدك مع {doctor.name} الساعة {selectedSlot}
            </div>
          </div>
        )}

        {/* Message button */}
        <button onClick={() => onMessage(doctor)} style={{
          width: "100%", background: "#fff",
          border: `1.5px solid ${doctor.color}`, borderRadius: 12, padding: "13px",
          fontFamily: "'Cairo',sans-serif", fontSize: 14, fontWeight: 700,
          color: doctor.color, cursor: "pointer",
        }}>
          💬 ابعت رسالة للدكتور
        </button>
      </div>
    </div>
  );
}
