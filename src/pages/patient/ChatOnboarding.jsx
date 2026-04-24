import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { HiOutlineLocationMarker } from 'react-icons/hi';

const KEYWORDS = {
  shoulder: ['shoulder','كتف','arm','ذراع','elbow','كوع','raise','رفع','rotator'],
  knee:     ['knee','ركبة','leg','ساق','thigh','فخذ','squat','ankle','كاحل'],
  neck:     ['neck','رقبة','head','رأس','cervical','headache','صداع'],
  back:     ['back','ظهر','spine','lumbar','lower back','خصر','disc'],
};

function detect(text) {
  const l = text.toLowerCase();
  for (const [inj, kws] of Object.entries(KEYWORDS))
    if (kws.some(k => l.includes(k))) return inj;
  return null;
}

const INJURY_NAMES = { shoulder:'Shoulder', knee:'Knee', neck:'Neck', back:'Back' };

const QUICK = [
  { label:'Shoulder',  injury:'shoulder', icon:'🦴' },
  { label:'Knee',      injury:'knee',     icon:'🦵' },
  { label:'Neck',      injury:'neck',     icon:'↕'  },
  { label:'Back',      injury:'back',     icon:'🔙' },
];

const WELCOME = {
  role:'bot',
  text:"Hello! I'm your AI 👋\nI'll help you find the right physical therapy plan.\nWhere are you experiencing pain or discomfort?",
  showQuick: true,
};

function Dot({ delay }) {
  return <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--gray-400)', display:'inline-block', animation:`pulse-dot 1.1s ${delay}s infinite` }}/>;
}

export default function ChatOnboarding() {
  const navigate = useNavigate();
  const [msgs,    setMsgs]    = useState([WELCOME]);
  const [input,   setInput]   = useState('');
  const [typing,  setTyping]  = useState(false);
  const [done,    setDone]    = useState(false);
  const [count,   setCount]   = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, typing]);

  function botReply(text, count) {
    const inj = detect(text);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      if (inj) {
        setMsgs(p => [...p, { role:'bot', text:`✅ Got it! I'll show you specialists for **${INJURY_NAMES[inj]}** injuries.\n\nNext, let's map your pain on a body diagram for a more accurate assessment.`, showQuick:false }]);
        setDone(true);
        setTimeout(() => navigate(`/patient/pain-map?injury=${inj}`), 2000);
      } else if (count === 1) {
        setMsgs(p => [...p, { role:'bot', text:'Which area best describes your pain?', showQuick:true }]);
      } else {
        setMsgs(p => [...p, { role:'bot', text:"Let me help you with the map instead:", showQuick:true }]);
      }
    }, 800);
  }

  function send(text) {
    const t = (text ?? input).trim();
    if (!t || done || typing) return;
    setInput('');
    const c = count + 1;
    setCount(c);
    setMsgs(p => [...p, { role:'user', text:t }]);
    botReply(t, c);
  }

  function quickPick(q) {
    if (done || typing) return;
    setMsgs(p => [...p, { role:'user', text:`${q.icon} ${q.label}` }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, { role:'bot', text:`✅ Got it! Showing specialists for **${q.label}** injuries.\n\nNext, let's map your exact pain location.`, showQuick:false }]);
      setDone(true);
      setTimeout(() => navigate(`/patient/pain-map?injury=${q.injury}`), 1800);
    }, 700);
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#f0f7ff,#fff)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:520, height:'85vh', maxHeight:680, background:'#fff', borderRadius:'var(--radius-xl)', boxShadow:'var(--shadow-lg)', border:'1px solid var(--gray-100)', display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Chat header */}
        <div style={{ background:'var(--primary)', padding:'16px 20px', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:'50%', background:'rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🤖</div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:'#fff' }}>your AI</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block' }}/>
              Online
            </div>
          </div>
          <div style={{ marginLeft:'auto' }}>
            <HiOutlineLocationMarker size={22} color="rgba(255,255,255,.7)"/>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:20, display:'flex', flexDirection:'column', gap:12 }}>
          {msgs.map((m, i) => {
            const isUser = m.role === 'user';
            return (
              <div key={i}>
                <div style={{ display:'flex', justifyContent:isUser?'flex-start':'flex-end' }}>
                  {!isUser && <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, marginRight:8, flexShrink:0, alignSelf:'flex-end' }}>🤖</div>}
                  <div style={{
                    maxWidth:'72%', padding:'11px 15px', fontSize:14, lineHeight:1.6, whiteSpace:'pre-wrap',
                    background: isUser ? 'var(--primary)' : '#fff',
                    color:      isUser ? '#fff' : 'var(--gray-800)',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    border: isUser ? 'none' : '1px solid var(--gray-100)',
                    boxShadow: 'var(--shadow-sm)',
                  }}>{m.text.replace(/\*\*(.*?)\*\*/g, '$1')}</div>
                </div>
                {/* Quick replies */}
                {!isUser && m.showQuick && i === msgs.length - 1 && !done && (
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:10, justifyContent:'flex-end' }}>
                    {QUICK.map(q => (
                      <button key={q.injury} onClick={() => quickPick(q)} style={{
                        padding:'8px 14px', border:'1.5px solid var(--gray-200)', borderRadius:'var(--radius-full)',
                        background:'#fff', cursor:'pointer', fontSize:13, fontWeight:600, color:'var(--gray-700)',
                        display:'flex', alignItems:'center', gap:6, transition:'all .15s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--gray-200)'; e.currentTarget.style.color='var(--gray-700)'; }}
                      >
                        {q.icon} {q.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {typing && (
            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              <div style={{ background:'#fff', border:'1px solid var(--gray-100)', borderRadius:'18px 18px 18px 4px', padding:'12px 16px', display:'flex', gap:5, alignItems:'center' }}>
                <Dot delay={0}/> <Dot delay={.18}/> <Dot delay={.36}/>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div style={{ padding:'12px 16px', borderTop:'1px solid var(--gray-100)', display:'flex', gap:8, alignItems:'flex-end' }}>
          <textarea value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} }}
            disabled={done||typing}
            placeholder={done ? 'Redirecting...' : 'Describe your pain or choose a quick option above...'}
            rows={1}
            style={{ flex:1, border:'1px solid var(--gray-200)', borderRadius:'var(--radius-md)', padding:'10px 14px', fontSize:14, resize:'none', outline:'none', fontFamily:'inherit', color:'var(--gray-800)', background:done?'var(--gray-50)':'#fff' }}
          />
          <button onClick={()=>send()} disabled={done||typing||!input.trim()} style={{
            width:42, height:42, borderRadius:'50%',
            background:done||typing||!input.trim()?'var(--gray-200)':'var(--primary)',
            color:'#fff', border:'none', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            <HiArrowRight size={18}/>
          </button>
        </div>
      </div>
      <style>{`@keyframes pulse-dot{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}`}</style>
    </div>
  );
}
