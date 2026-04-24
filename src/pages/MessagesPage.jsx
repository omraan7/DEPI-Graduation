import { useState, useRef, useEffect } from "react";

export default function MessagesPage({ doctor, onBack }) {
  const [messages, setMessages] = useState([
    { from: "doctor", text: `أهلاً! أنا ${doctor?.name || "الدكتور"}. كيف أقدر أساعدك؟`, time: formatTime() },
  ]);
  const [input, setInput]     = useState("");
  const [typing, setTyping]   = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function formatTime() {
    return new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
  }

  // Simple auto-reply from doctor
  const AUTO_REPLIES = [
    "تمام، هخليك تبدأ تمارين خفيفة الأسبوع الجاي 💪",
    "عظيم! استمر على نفس الروتين.",
    "الألم طبيعي في البداية، لكن لو اشتد وقّف وكلمني.",
    "ممتاز! التقدم واضح من السجلات.",
    "اعمل التمرين ببطء وركز على الزاوية الصح.",
  ];

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages(prev => [...prev, { from: "patient", text, time: formatTime() }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      setMessages(prev => [...prev, { from: "doctor", text: reply, time: formatTime() }]);
    }, 1000 + Math.random() * 800);
  }

  if (!doctor) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'Cairo',sans-serif", color: "#94a3b8", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 48 }}>💬</div>
      <div>لا توجد محادثات بعد</div>
      <div style={{ fontSize: 13 }}>احجز جلسة مع دكتور للتواصل معه</div>
    </div>
  );

  return (
    <div style={{
      height: "100vh", background: "#f8fafc",
      fontFamily: "'Cairo',sans-serif", direction: "rtl",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #f1f5f9",
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
        flexShrink: 0,
      }}>
        {onBack && (
          <button onClick={onBack} style={{
            background: "#f1f5f9", border: "none", borderRadius: 10,
            padding: "6px 12px", cursor: "pointer",
            fontFamily: "'Cairo',sans-serif", fontSize: 13, color: "#64748b",
          }}>←</button>
        )}
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: (doctor.color || "#2563eb") + "20",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, color: doctor.color || "#2563eb",
        }}>{doctor.avatar}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{doctor.name}</div>
          <div style={{ fontSize: 11, color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }}/>
            متصل الآن
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {messages.map((m, i) => {
          const isPatient = m.from === "patient";
          return (
            <div key={i} style={{
              display: "flex", justifyContent: isPatient ? "flex-start" : "flex-end",
              marginBottom: 10,
            }}>
              {!isPatient && (
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: (doctor.color || "#2563eb") + "20",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: doctor.color || "#2563eb",
                  marginLeft: 8, flexShrink: 0, alignSelf: "flex-end",
                }}>{doctor.avatar}</div>
              )}
              <div>
                <div style={{
                  maxWidth: 260,
                  background: isPatient ? "#1e293b" : "#fff",
                  color: isPatient ? "#fff" : "#1e293b",
                  borderRadius: isPatient ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "10px 14px", fontSize: 14, lineHeight: 1.5,
                  border: isPatient ? "none" : "1px solid #f1f5f9",
                  boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                }}>{m.text}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3, textAlign: isPatient ? "right" : "left" }}>
                  {m.time}
                </div>
              </div>
            </div>
          );
        })}
        {typing && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10, gap: 8 }}>
            <div style={{
              background: "#fff", border: "1px solid #f1f5f9", borderRadius: "18px 18px 18px 4px",
              padding: "10px 14px", display: "flex", gap: 4, alignItems: "center",
            }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#94a3b8",
                  animation: `bounce 1.1s ${i*0.18}s infinite`,
                }}/>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
        <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}`}</style>
      </div>

      {/* Input */}
      <div style={{
        background: "#fff", borderTop: "1px solid #f1f5f9",
        padding: "12px 16px", display: "flex", gap: 8, alignItems: "flex-end",
        paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
        marginBottom: 60,
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="اكتب رسالة..."
          rows={1}
          style={{
            flex: 1, border: "1px solid #e2e8f0", borderRadius: 14,
            padding: "10px 14px", fontFamily: "'Cairo',sans-serif",
            fontSize: 14, resize: "none", outline: "none", color: "#1e293b",
          }}
        />
        <button onClick={handleSend} disabled={!input.trim()} style={{
          width: 42, height: 42, borderRadius: "50%",
          background: input.trim() ? "#1e293b" : "#e2e8f0",
          color: "#fff", border: "none", cursor: input.trim() ? "pointer" : "default",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
          flexShrink: 0,
        }}>➤</button>
      </div>
    </div>
  );
}
