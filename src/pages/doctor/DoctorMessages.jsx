import { useState, useRef, useEffect } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import { MOCK_PATIENTS } from '../../data/mockData';
import Avatar from '../../components/ui/Avatar';

const CONVOS = MOCK_PATIENTS.map((p, i) => ({
  patient: p,
  lastMsg: ['How are the exercises going?', 'Your pain level looks better!', 'See you next session.', 'Please do the warm-up.'][i] || 'Great progress!',
  time: ['2m ago','1h ago','3h ago','1d ago'][i],
  unread: [2,0,1,0][i],
}));

const AUTO = ['Great! Keep up the exercises.','Rest if pain exceeds 7/10.','Your progress is on track.','I updated your plan.'];

export default function DoctorMessages() {
  const [active, setActive] = useState(CONVOS[0]);
  const [msgs,   setMsgs]   = useState([
    { from:'doctor',  text:'Hello! How are you feeling after yesterday\'s session?', time:'9:00 AM' },
    { from:'patient', text:'Much better! The shoulder pain reduced significantly.', time:'9:05 AM' },
    { from:'doctor',  text:'Excellent! Keep doing the abduction exercises daily.', time:'9:06 AM' },
  ]);
  const [input, setInput]   = useState('');
  const [typing,setTyping]  = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, typing]);

  function fmt() { return new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}); }

  function send() {
    const t = input.trim();
    if (!t) return;
    setInput('');
    setMsgs(p => [...p, { from:'doctor', text:t, time:fmt() }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, { from:'patient', text:AUTO[Math.floor(Math.random()*AUTO.length)], time:fmt() }]);
    }, 900 + Math.random()*600);
  }

  return (
    <div style={{ display:'flex', gap:0, height:'calc(100vh - 128px)', background:'#fff', borderRadius:'var(--radius-lg)', border:'1px solid var(--gray-100)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>

      {/* Sidebar */}
      <div style={{ width:280, borderRight:'1px solid var(--gray-100)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'16px', borderBottom:'1px solid var(--gray-100)' }}>
          <h3 style={{ fontWeight:700, fontSize:16, margin:0 }}>Messages</h3>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {CONVOS.map(c => (
            <button key={c.patient.id} onClick={() => setActive(c)} style={{
              width:'100%', padding:'14px 16px', border:'none', textAlign:'left', cursor:'pointer',
              background: active.patient.id===c.patient.id ? 'var(--primary-light)' : '#fff',
              borderBottom:'1px solid var(--gray-50)', transition:'background .1s',
              display:'flex', alignItems:'center', gap:12,
            }}>
              <div style={{ position:'relative', flexShrink:0 }}>
                <Avatar initials={c.patient.avatar} size={40}/>
                {c.unread > 0 && (
                  <span style={{ position:'absolute', top:-3, right:-3, width:18, height:18, borderRadius:'50%', background:'var(--primary)', color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{c.unread}</span>
                )}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontWeight:600, fontSize:13, color:'var(--gray-900)' }}>{c.patient.name}</span>
                  <span style={{ fontSize:11, color:'var(--gray-400)', flexShrink:0 }}>{c.time}</span>
                </div>
                <div style={{ fontSize:12, color:'var(--gray-500)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.lastMsg}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
        {/* Chat header */}
        <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--gray-100)', display:'flex', alignItems:'center', gap:12 }}>
          <Avatar initials={active.patient.avatar} size={38}/>
          <div>
            <div style={{ fontWeight:700, fontSize:14 }}>{active.patient.name}</div>
            <div style={{ fontSize:12, color:'var(--gray-400)' }}>{active.patient.injury} injury · Age {active.patient.age}</div>
          </div>
        </div>

     
        <div style={{ flex:1, overflowY:'auto', padding:'16px 20px', display:'flex', flexDirection:'column', gap:12, background:'var(--gray-50)' }}>
          {msgs.map((m, i) => {
            const isDoctor = m.from === 'doctor';
            return (
              <div key={i} style={{ display:'flex', justifyContent:isDoctor?'flex-start':'flex-end' }}>
                {isDoctor && <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:700, marginRight:8, flexShrink:0, alignSelf:'flex-end' }}>SA</div>}
                <div>
                  <div style={{
                    maxWidth:300, padding:'10px 14px', fontSize:14, lineHeight:1.55, borderRadius: isDoctor?'18px 18px 18px 4px':'18px 18px 4px 18px',
                    background: isDoctor ? '#fff' : 'var(--primary)', color: isDoctor ? 'var(--gray-800)' : '#fff',
                    border: isDoctor ? '1px solid var(--gray-100)' : 'none', boxShadow:'var(--shadow-sm)',
                  }}>{m.text}</div>
                  <div style={{ fontSize:10, color:'var(--gray-400)', marginTop:3, textAlign:isDoctor?'left':'right' }}>{m.time}</div>
                </div>
              </div>
            );
          })}
          {typing && (
            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              <div style={{ background:'#fff', border:'1px solid var(--gray-100)', borderRadius:'18px 18px 18px 4px', padding:'11px 16px', display:'flex', gap:4, alignItems:'center' }}>
                {[0,.18,.36].map(d => <span key={d} style={{ width:6,height:6,borderRadius:'50%',background:'var(--gray-400)',display:'inline-block',animation:`dot 1.1s ${d}s infinite` }}/>)}
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>

        {/* Input */}
        <div style={{ padding:'12px 20px', borderTop:'1px solid var(--gray-100)', display:'flex', gap:10, alignItems:'flex-end' }}>
          <textarea value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder="Write a message..." rows={1}
            style={{ flex:1, border:'1px solid var(--gray-200)', borderRadius:'var(--radius-md)', padding:'10px 14px', fontSize:14, fontFamily:'inherit', resize:'none', outline:'none' }}
          />
          <button onClick={send} disabled={!input.trim()} style={{ width:40,height:40,borderRadius:'50%',border:'none',background:input.trim()?'var(--primary)':'var(--gray-200)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',cursor:input.trim()?'pointer':'default',transition:'background .15s',flexShrink:0 }}>
            <HiArrowRight size={17}/>
          </button>
        </div>
      </div>
      <style>{`@keyframes dot{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}`}</style>
    </div>
  );
}
