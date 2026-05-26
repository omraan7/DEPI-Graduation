import { useState, useRef, useEffect, useContext } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import { AuthContext } from '../../context/AuthContext';
import Avatar from '../../components/ui/Avatar';

export default function DoctorMessages() {
  const { user, token } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  // Fetch doctor's patients
  useEffect(() => {
    async function loadPatients() {
      try {
        const res = await fetch('/api/doctor/patients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPatients(data);
          if (data.length > 0) setActivePatient(data[0]);
        }
      } catch (err) {
        console.error('Failed to load patients for messages', err);
      }
    }
    loadPatients();
  }, [token]);

  // Fetch messages when active patient changes
  useEffect(() => {
    if (!activePatient) return;
    async function loadMsgs() {
      try {
        const res = await fetch(`/api/messages/${activePatient.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMsgs(data.map(m => ({
            id: m._id,
            from: m.sender === user._id ? 'doctor' : 'patient',
            text: m.content,
            time: new Date(m.createdAt).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})
          })));
        }
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    }
    loadMsgs();
  }, [activePatient, token, user._id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, sending]);

  function fmt() { return new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}); }

  async function send() {
    const t = input.trim();
    if (!t || sending || !activePatient) return;
    setInput('');
    setMsgs(p => [...p, { id: Date.now(), from:'doctor', text:t, time:fmt() }]);
    setSending(true);

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: activePatient.id,
          content: t
        })
      });
    } catch (err) {
      console.error('Failed to send msg', err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ display:'flex', gap:0, height:'calc(100vh - 128px)', background:'#fff', borderRadius:'var(--radius-lg)', border:'1px solid var(--gray-100)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>

      {/* Sidebar */}
      <div style={{ width:280, borderRight:'1px solid var(--gray-100)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'16px', borderBottom:'1px solid var(--gray-100)' }}>
          <h3 style={{ fontWeight:700, fontSize:16, margin:0 }}>Messages</h3>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {patients.map(p => (
            <button key={p.id} onClick={() => setActivePatient(p)} style={{
              width:'100%', padding:'14px 16px', border:'none', textAlign:'left', cursor:'pointer',
              background: activePatient?.id===p.id ? 'var(--primary-light)' : '#fff',
              borderBottom:'1px solid var(--gray-50)', transition:'background .1s',
              display:'flex', alignItems:'center', gap:12,
            }}>
              <div style={{ position:'relative', flexShrink:0 }}>
                <Avatar initials={p.avatar} size={40}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontWeight:600, fontSize:13, color:'var(--gray-900)' }}>{p.name}</span>
                </div>
                <div style={{ fontSize:12, color:'var(--gray-500)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Patient</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
        {/* Chat header */}
        {activePatient ? (
          <>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--gray-100)', display:'flex', alignItems:'center', gap:12 }}>
              <Avatar initials={activePatient.avatar} size={38}/>
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>{activePatient.name}</div>
                <div style={{ fontSize:12, color:'var(--gray-400)' }}>{activePatient.injury} injury · Age {activePatient.age}</div>
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
          {sending && (
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
          <button onClick={send} disabled={!input.trim() || sending} style={{ width:40,height:40,borderRadius:'50%',border:'none',background:input.trim()&&!sending?'var(--primary)':'var(--gray-200)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',cursor:input.trim()&&!sending?'pointer':'default',transition:'background .15s',flexShrink:0 }}>
            <HiArrowRight size={17}/>
          </button>
        </div>
        </>
        ) : (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gray-400)' }}>
            Select a patient to start messaging
          </div>
        )}
      </div>
      <style>{`@keyframes dot{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}`}</style>
    </div>
  );
}
