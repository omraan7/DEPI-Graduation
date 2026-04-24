import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';

export default function DoctorSettings() {
  const [name,     setName]     = useState('Dr. Sarah Ahmed');
  const [email,    setEmail]    = useState('sarah@physiohome.com');
  const [phone,    setPhone]    = useState('+20 100 000 0000');
  const [spec,     setSpec]     = useState('Shoulder & Spine Rehabilitation');
  const [notif,    setNotif]    = useState({ sessions:true, messages:true, progress:false });
  const [saved,    setSaved]    = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputStyle = {
    width:'100%', border:'1px solid var(--gray-200)', borderRadius:'var(--radius-md)',
    padding:'10px 14px', fontSize:14, fontFamily:'inherit', outline:'none', color:'var(--gray-800)',
  };
  const labelStyle = { fontSize:13, fontWeight:600, color:'var(--gray-600)', display:'block', marginBottom:6 };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:640 }}>
      <div>
        <h1 style={{ fontSize:24, fontWeight:800, color:'var(--gray-900)', margin:0 }}>Settings</h1>
        <p style={{ color:'var(--gray-500)', marginTop:4 }}>Manage your profile and preferences.</p>
      </div>

      {/* Profile */}
      <Card style={{ padding:'24px' }}>
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:20 }}>Profile Information</h3>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
          <Avatar initials="SA" color="#db2777" size={64}/>
          <Button variant="ghost" size="sm">Change Photo</Button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} style={inputStyle}/>
          </div>
          <div>
            <label style={labelStyle}>Specialty</label>
            <input value={spec} onChange={e=>setSpec(e.target.value)} style={inputStyle}/>
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle}/>
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} style={inputStyle}/>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card style={{ padding:'24px' }}>
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Notifications</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {[
            { id:'sessions', label:'Session Reminders',   desc:'Get notified before patient sessions' },
            { id:'messages', label:'New Messages',         desc:'Notifications for patient messages' },
            { id:'progress', label:'Progress Updates',     desc:'Weekly patient progress summaries' },
          ].map(n => (
            <div key={n.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontWeight:600, fontSize:14 }}>{n.label}</div>
                <div style={{ fontSize:13, color:'var(--gray-500)', marginTop:2 }}>{n.desc}</div>
              </div>
              <button onClick={() => setNotif(p=>({...p,[n.id]:!p[n.id]}))} style={{
                width:44, height:24, borderRadius:12, border:'none', cursor:'pointer',
                background: notif[n.id] ? 'var(--primary)' : 'var(--gray-200)',
                position:'relative', transition:'background .2s',
              }}>
                <span style={{
                  position:'absolute', top:3, width:18, height:18, borderRadius:'50%', background:'#fff',
                  left: notif[n.id] ? 'calc(100% - 21px)' : '3px', transition:'left .2s',
                  boxShadow:'0 1px 4px rgba(0,0,0,.2)',
                }}/>
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Button size="lg" onClick={save} style={{ background:saved?'#10b981':'var(--primary)', border:'none' }}>
        {saved ? '✓ Saved!' : 'Save Changes'}
      </Button>
    </div>
  );
}
