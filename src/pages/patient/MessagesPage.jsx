import { useState, useRef, useEffect } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import { FiPhone, FiVideo } from 'react-icons/fi';
import Card from '../../components/ui/Card';

const DOCTOR = { name:'Dr. Sarah Ahmed', avatar:'SA', color:'#db2777', specialty:'Shoulder Specialist' };

const INITIAL_MSGS = [
  { from:'doctor', text:"Hello Ahmed! How are you feeling today?", time:'10:00 AM' },
  { from:'patient',text:"Hi Doctor! My shoulder feels a bit better after yesterday's exercises.", time:'10:02 AM' },
  { from:'doctor', text:"That's great progress! Did you manage to do the full overhead raises?", time:'10:03 AM' },
  { from:'patient',text:"Yes! I reached about 140° this time.", time:'10:05 AM' },
  { from:'doctor', text:"Excellent! 140° is a big improvement. Keep at it — I've updated your target angle to 150° for this week. 💪", time:'10:06 AM' },
];

const AUTO_REPLIES = [
  "Great work! Keep up the good effort.",
  "That's expected during recovery. If the pain exceeds 7/10, please rest.",
  "I'll review your latest session data and update your plan.",
  "Remember to do the warm-up stretches before each session.",
  "Your progress chart is looking really positive!",
];

function Dot({ delay }) {
  return <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--gray-400)', display:'inline-block', animation:`dot-pulse 1.1s ${delay}s infinite` }}/>;
}

export default function MessagesPage() {
  const [msgs,   setMsgs]   = useState(INITIAL_MSGS);
  const [input,  setInput]  = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, typing]);

  function formatTime() { return new Date().toLocaleTimeString('en-US',{ hour:'2-digit', minute:'2-digit' }); }

  function send() {
    const t = input.trim();
    if (!t || typing) return;
    setInput('');
    setMsgs(p => [...p, { from:'patient', text:t, time:formatTime() }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = AUTO_REPLIES[Math.floor(Math.random()*AUTO_REPLIES.length)];
      setMsgs(p => [...p, { from:'doctor', text:reply, time:formatTime() }]);
    }, 1000 + Math.random()*800);
  }

  return (
    <div style={{ height:'calc(100vh - 126px)', display:'flex', flexDirection:'column' }}>
      {/* Doctor header */}
      <div style={{
        background:'#fff', borderBottom:'1px solid var(--gray-100)',
        padding:'12px 20px', display:'flex', alignItems:'center', gap:12,
        flexShrink:0,
      }}>
        <div style={{ width:42, height:42, borderRadius:'50%', background:DOCTOR.color+'20', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:DOCTOR.color, fontSize:14 }}>{DOCTOR.avatar}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:15, color:'var(--gray-900)' }}>{DOCTOR.name}</div>
          <div style={{ fontSize:12, color:'#10b981', display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', display:'inline-block' }}/> Online
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button style={{ width:36, height:36, borderRadius:'50%', border:'1px solid var(--gray-200)', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--gray-500)' }}>
            <FiPhone size={16}/>
          </button>
          <button style={{ width:36, height:36, borderRadius:'50%', border:'1px solid var(--gray-200)', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--gray-500)' }}>
            <FiVideo size={16}/>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px', display:'flex', flexDirection:'column', gap:12, background:'var(--gray-50)' }}>
        {msgs.map((m, i) => {
          const isPatient = m.from === 'patient';
          return (
            <div key={i} style={{ display:'flex', justifyContent:isPatient?'flex-start':'flex-end' }}>
              {!isPatient && (
                <div style={{ width:28, height:28, borderRadius:'50%', background:DOCTOR.color+'20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:DOCTOR.color, marginRight:8, flexShrink:0, alignSelf:'flex-end' }}>{DOCTOR.avatar}</div>
              )}
              <div>
                <div style={{
                  maxWidth:280, padding:'10px 14px', fontSize:14, lineHeight:1.55,
                  background: isPatient ? 'var(--primary)' : '#fff',
                  color:      isPatient ? '#fff'           : 'var(--gray-800)',
                  borderRadius: isPatient ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  border: isPatient ? 'none' : '1px solid var(--gray-100)',
                  boxShadow: 'var(--shadow-sm)',
                }}>{m.text}</div>
                <div style={{ fontSize:10, color:'var(--gray-400)', marginTop:3, textAlign:isPatient?'right':'left' }}>{m.time}</div>
              </div>
            </div>
          );
        })}

        {typing && (
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <div style={{ background:'#fff', border:'1px solid var(--gray-100)', borderRadius:'18px 18px 18px 4px', padding:'12px 16px', display:'flex', gap:5, alignItems:'center', boxShadow:'var(--shadow-sm)' }}>
              <Dot delay={0}/>&nbsp;<Dot delay={.18}/>&nbsp;<Dot delay={.36}/>
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Input */}
      <div style={{ background:'#fff', borderTop:'1px solid var(--gray-100)', padding:'12px 20px', display:'flex', gap:10, alignItems:'flex-end', flexShrink:0 }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} }}
          placeholder="Message Dr. Sarah..." rows={1}
          style={{ flex:1, border:'1px solid var(--gray-200)', borderRadius:'var(--radius-md)', padding:'10px 14px', fontSize:14, fontFamily:'inherit', resize:'none', outline:'none', color:'var(--gray-800)' }}
        />
        <button onClick={send} disabled={!input.trim()||typing} style={{
          width:42, height:42, borderRadius:'50%', border:'none',
          background: input.trim()&&!typing ? 'var(--primary)' : 'var(--gray-200)',
          color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
          cursor: input.trim()&&!typing ? 'pointer' : 'default', flexShrink:0, transition:'background .15s',
        }}>
          <HiArrowRight size={18}/>
        </button>
      </div>

      <style>{`@keyframes dot-pulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}`}</style>
    </div>
  );
}
