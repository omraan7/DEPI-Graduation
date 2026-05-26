import { useState, useRef, useEffect, useContext } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import { FiPhone, FiVideo } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/ui/Card';

const DEFAULT_DOCTOR = { name:'Dr. Sarah Ahmed', avatar:'SA', color:'#db2777', specialty:'Specialist' };

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
  const { user, token } = useContext(AuthContext);
  const [msgs,   setMsgs]   = useState([]);
  const [input,  setInput]  = useState('');
  const [sending, setSending] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(DEFAULT_DOCTOR);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, sending]);

  // Fetch initial data: find a doctor, then fetch messages
  useEffect(() => {
    async function loadData() {
      try {
        const docRes = await fetch('/api/patient/doctors', { headers: { Authorization: `Bearer ${token}` } });
        if (docRes.ok) {
          const docs = await docRes.json();
          if (docs.length > 0) {
            const doc = docs[0];
            setDoctorId(doc._id);
            setDoctorInfo({
              name: `Dr. ${doc.name}`,
              avatar: doc.name.charAt(0).toUpperCase(),
              color: '#db2777',
              specialty: doc.specialization || 'Physiotherapist'
            });

            // Fetch messages with this doctor
            const msgRes = await fetch(`/api/messages/${doc._id}`, { headers: { Authorization: `Bearer ${token}` } });
            if (msgRes.ok) {
              const msgData = await msgRes.json();
              setMsgs(msgData.map(m => ({
                id: m._id,
                from: m.sender === user._id ? 'patient' : 'doctor',
                text: m.content,
                time: new Date(m.createdAt).toLocaleTimeString('en-US',{ hour:'2-digit', minute:'2-digit' })
              })));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    }
    loadData();
  }, [token, user._id]);

  function formatTime() { return new Date().toLocaleTimeString('en-US',{ hour:'2-digit', minute:'2-digit' }); }

  async function send() {
    const t = input.trim();
    if (!t || sending || !doctorId) return;
    setInput('');
    // Optimistic UI
    setMsgs(p => [...p, { id: Date.now(), from:'patient', text:t, time:formatTime() }]);
    setSending(true);

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: doctorId,
          content: t
        })
      });
      // Optionally, you could simulate an auto-reply here for demonstration
      setTimeout(() => {
        setMsgs(p => [...p, { id: Date.now()+1, from:'doctor', text:"I have received your message and will review it shortly.", time:formatTime() }]);
      }, 1500);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ height:'calc(100vh - 126px)', display:'flex', flexDirection:'column' }}>
      {/* Doctor header */}
      <div style={{
        background:'#fff', borderBottom:'1px solid var(--gray-100)',
        padding:'12px 20px', display:'flex', alignItems:'center', gap:12,
        flexShrink:0,
      }}>
        <div style={{ width:42, height:42, borderRadius:'50%', background:doctorInfo.color+'20', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:doctorInfo.color, fontSize:14 }}>{doctorInfo.avatar}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:15, color:'var(--gray-900)' }}>{doctorInfo.name}</div>
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
            <div key={m.id || i} style={{ display:'flex', justifyContent:isPatient?'flex-start':'flex-end' }}>
              {!isPatient && (
                <div style={{ width:28, height:28, borderRadius:'50%', background:doctorInfo.color+'20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:doctorInfo.color, marginRight:8, flexShrink:0, alignSelf:'flex-end' }}>{doctorInfo.avatar}</div>
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

        {sending && (
          <div style={{ display:'flex', justifyContent:'flex-start' }}>
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
          placeholder={`Message ${doctorInfo.name}...`} rows={1}
          style={{ flex:1, border:'1px solid var(--gray-200)', borderRadius:'var(--radius-md)', padding:'10px 14px', fontSize:14, fontFamily:'inherit', resize:'none', outline:'none', color:'var(--gray-800)' }}
          disabled={!doctorId}
        />
        <button onClick={send} disabled={!input.trim()||sending||!doctorId} style={{
          width:42, height:42, borderRadius:'50%', border:'none',
          background: input.trim()&&!sending&&doctorId ? 'var(--primary)' : 'var(--gray-200)',
          color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
          cursor: input.trim()&&!sending&&doctorId ? 'pointer' : 'default', flexShrink:0, transition:'background .15s',
        }}>
          <HiArrowRight size={18}/>
        </button>
      </div>

      <style>{`@keyframes dot-pulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}`}</style>
    </div>
  );
}
