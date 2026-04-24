import { useState, useRef, useEffect } from "react";

// ── Keyword map — no API needed ───────────────────────────────
const INJURY_KEYWORDS = {
  shoulder: ["كتف","كتفي","كتفين","الكتف","ذراع","ذراعي","إيد","ايد","يدي","رفع","الرفع","shoulder","arm"],
  knee:     ["ركبة","ركبتي","ركبه","الركبة","ساق","ساقي","فخذ","فخذي","knee","leg"],
  neck:     ["رقبة","رقبتي","رقبه","الرقبة","عنق","رأس","راسي","neck","head"],
  back:     ["ظهر","ظهري","الظهر","أسفل الظهر","اسفل الظهر","خصر","خصري","back","spine"],
};

const INJURY_NAMES = { shoulder:"الكتف", knee:"الركبة", neck:"الرقبة", back:"الظهر" };

const QUICK_REPLIES = [
  { label:"🦴 الكتف",  injury:"shoulder" },
  { label:"🦵 الركبة", injury:"knee"     },
  { label:"↕ الرقبة",  injury:"neck"     },
  { label:"🔙 الظهر",  injury:"back"     },
];

function detectInjury(text) {
  const lower = text.toLowerCase();
  for (const [injury, kws] of Object.entries(INJURY_KEYWORDS)) {
    if (kws.some(kw => lower.includes(kw))) return injury;
  }
  return null;
}

function getBotReply(userText, count) {
  const injury = detectInjury(userText);
  if (injury) return { text:`✅ فاهمك!\nهفتحلك تمارين خاصة بإصابة ${INJURY_NAMES[injury]} دلوقتي...`, injury, showQuick:false };
  if (count === 1) return { text:"تمام! الألم في أنهي منطقة بالظبط؟", injury:null, showQuick:true };
  return { text:"مش فاهم كويس 😅\nاختار من الأزرار:", injury:null, showQuick:true };
}

const WELCOME = {
  role:"assistant",
  content:"مرحباً! أنا عمران 👋\nأنا هساعدك تعمل تمارين العلاج الطبيعي الصح.\nفين بالظبط بتحس بالألم؟",
  showQuick:true,
};

function TypingDots() {
  return (
    <div style={{ display:"flex", gap:4, alignItems:"center", padding:"4px 2px" }}>
      {[0,1,2].map(i=>(
        <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:"#94a3b8", animation:`bounce 1.1s ${i*0.18}s infinite` }}/>
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-6px);opacity:1}}`}</style>
    </div>
  );
}

function Bubble({ msg, onQuickReply, disabled }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:"flex", justifyContent:isUser?"flex-start":"flex-end" }}>
        {!isUser && (
          <div style={{ width:32, height:32, borderRadius:"50%", background:"#c4dafc", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, marginLeft:8, flexShrink:0, alignSelf:"flex-end" }}>🤖</div>
        )}
        <div style={{
          maxWidth:"72%", background:isUser?"#1e293b":"#fff", color:isUser?"#fff":"#1e293b",
          borderRadius:isUser?"18px 18px 4px 18px":"18px 18px 18px 4px",
          padding:"11px 15px", fontSize:14, lineHeight:1.65,
          boxShadow:"0 1px 4px rgba(0,0,0,.08)", whiteSpace:"pre-wrap",
          border:isUser?"none":"1px solid #f1f5f9",
        }}>{msg.content}</div>
        {isUser && (
          <div style={{ width:32, height:32, borderRadius:"50%", background:"#1e293b", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, marginRight:8, flexShrink:0, alignSelf:"flex-end" }}>🧑</div>
        )}
      </div>
      {!isUser && msg.showQuick && (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:10, marginRight:44, justifyContent:"flex-end" }}>
          {QUICK_REPLIES.map(q=>(
            <button key={q.injury} onClick={()=>!disabled&&onQuickReply(q)} style={{
              background:disabled?"#f1f5f9":"#fff", color:disabled?"#94a3b8":"#1e293b",
              border:"1.5px solid #e2e8f0", borderRadius:20, padding:"7px 14px",
              fontFamily:"'Cairo',sans-serif", fontSize:13, fontWeight:700,
              cursor:disabled?"default":"pointer", transition:"all .15s",
            }}>{q.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChatOnboarding({ onInjuryDetected }) {
  const [messages,     setMessages]     = useState([WELCOME]);
  const [input,        setInput]        = useState("");
  const [typing,       setTyping]       = useState(false);
  const [done,         setDone]         = useState(false);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, typing]);

  function botReply(userText, count) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = getBotReply(userText, count);
      setMessages(prev => [...prev, { role:"assistant", content:reply.text, showQuick:reply.showQuick }]);
      if (reply.injury) { setDone(true); setTimeout(()=>onInjuryDetected(reply.injury), 1800); }
    }, 700);
  }

  function handleSend(text) {
    const trimmed = (text ?? input).trim();
    if (!trimmed || done || typing) return;
    setInput("");
    const newCount = userMsgCount + 1;
    setUserMsgCount(newCount);
    setMessages(prev => [...prev, { role:"user", content:trimmed }]);
    botReply(trimmed, newCount);
  }

  function handleQuickReply(q) {
    if (done || typing) return;
    setUserMsgCount(c => c+1);
    setMessages(prev => [...prev, { role:"user", content:q.label }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role:"assistant", content:`✅ فاهمك!\nهفتحلك تمارين خاصة بإصابة ${INJURY_NAMES[q.injury]} دلوقتي...`, showQuick:false }]);
      setDone(true);
      setTimeout(() => onInjuryDetected(q.injury), 1800);
    }, 600);
  }

  return (
    <div style={{ width:"100vw", height:"100vh", background:"#f8fafc", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Cairo',sans-serif", direction:"rtl" }}>
      <div style={{ width:"100%", maxWidth:520, height:"85vh", maxHeight:700, background:"#fff", borderRadius:24, boxShadow:"0 8px 40px rgba(0,0,0,.10)", display:"flex", flexDirection:"column", overflow:"hidden", border:"1px solid #e2e8f0" }}>

        {/* Header */}
        <div style={{ background:"#c4dafc", padding:"16px 20px", display:"flex", alignItems:"center", gap:12, borderBottom:"1px solid #e2e8f0" }}>
          <div style={{ width:42, height:42, borderRadius:"50%", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:"0 2px 8px rgba(0,0,0,.1)" }}>🤖</div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:"#1e293b" }}>عمران</div>
            <div style={{ fontSize:11, color:"#64748b" }}>مساعد العلاج الطبيعي</div>
          </div>
          <div style={{ marginRight:"auto", display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#16a34a" }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#16a34a" }}/>
            متصل
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 16px", display:"flex", flexDirection:"column" }}>
          {messages.map((m,i)=>(
            <Bubble key={i} msg={m} onQuickReply={handleQuickReply} disabled={done||typing||i<messages.length-1}/>
          ))}
          {typing && (
            <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:10 }}>
              <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:"18px 18px 18px 4px", padding:"11px 15px", boxShadow:"0 1px 4px rgba(0,0,0,.08)" }}>
                <TypingDots/>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div style={{ padding:"12px 16px", borderTop:"1px solid #f1f5f9", display:"flex", gap:8, alignItems:"flex-end", background:"#fafafa" }}>
          <textarea
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();} }}
            disabled={done||typing}
            placeholder={done?"جاري الانتقال...":"اكتب هنا أو اضغط على الأزرار..."}
            rows={1}
            style={{ flex:1, border:"1px solid #e2e8f0", borderRadius:14, padding:"10px 14px", fontFamily:"'Cairo',sans-serif", fontSize:14, resize:"none", outline:"none", background:done?"#f1f5f9":"#fff", color:"#1e293b", lineHeight:1.5, maxHeight:100, overflowY:"auto" }}
          />
          <button onClick={()=>handleSend()} disabled={done||typing||!input.trim()} style={{ width:44, height:44, borderRadius:"50%", background:done||typing||!input.trim()?"#e2e8f0":"#1e293b", color:"#fff", border:"none", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, cursor:done||typing||!input.trim()?"default":"pointer", flexShrink:0, transition:"background .2s" }}>➤</button>
        </div>
      </div>

      <div style={{ marginTop:14, fontSize:12, color:"#94a3b8" }}>Omran Rehab · يشتغل بدون إنترنت</div>
    </div>
  );
}
