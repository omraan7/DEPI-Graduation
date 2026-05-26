import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowRight, HiStar } from 'react-icons/hi';
import { FiActivity, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const DOCTOR = {
  name:'Dr. Sarah Ahmed', specialty:'Shoulder Specialist',
  avatar:'SA', color:'#db2777', rating:4.9,
};

export default function PatientHome() {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  
  const [exercises, setExercises] = useState([]);
  const [painLevel, setPainLevel] = useState('-');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [exRes, painRes] = await Promise.all([
          fetch('/api/patient/exercises', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/patient/pain', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (exRes.ok) {
          const exData = await exRes.json();
          setExercises(exData.map(e => e.exercise));
        }

        if (painRes.ok) {
          const painData = await painRes.json();
          if (painData.length > 0) {
            setPainLevel(`${painData[0].painLevel}/10`);
          }
        }
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const stats = [
    { label:'Sessions',    value:8,   icon:<FiActivity size={18}/>,  color:'#1a56db' },
    { label:'Exercises',   value:exercises.length || 0,  icon:<FiCalendar size={18}/>,  color:'#10b981' },
    { label:'Pain Level',  value:painLevel, icon:'😊',                  color:'#f59e0b' },
  ];

  return (
    <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:20 }}>
      {/* Greeting */}
      <div style={{ background:'linear-gradient(135deg,var(--primary),#1e40af)', borderRadius:'var(--radius-xl)', padding:'24px 20px', color:'#fff' }}>
        <div style={{ fontSize:13, opacity:.8 }}>{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</div>
        <h2 style={{ fontSize:22, fontWeight:800, marginTop:6, marginBottom:4 }}>Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h2>
        <p style={{ fontSize:14, opacity:.8, marginBottom:20 }}>Continue your shoulder recovery journey</p>
        <Button variant="white" size="md" iconRight={<HiArrowRight/>} onClick={() => navigate('/patient/tracker')}>
          Start Session
        </Button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ padding:'16px', textAlign:'center' }}>
            <div style={{ color:s.color, marginBottom:8 }}>{typeof s.icon === 'string' ? <span style={{ fontSize:20 }}>{s.icon}</span> : s.icon}</div>
            <div style={{ fontWeight:900, fontSize:22, color:'var(--gray-900)', lineHeight:1.2 }}>{s.value}</div>
            <div style={{ fontSize:11, color:'var(--gray-500)', marginTop:2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* My Doctor */}
      <Card style={{ borderLeft:`4px solid ${DOCTOR.color}` }}>
        <div style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:12 }}>My Doctor</div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:48, height:48, borderRadius:'50%', background:DOCTOR.color+'20', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:DOCTOR.color, fontSize:15, flexShrink:0 }}>{DOCTOR.avatar}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:15 }}>{DOCTOR.name}</div>
            <div style={{ fontSize:13, color:'var(--gray-500)' }}>{DOCTOR.specialty}</div>
            <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:4 }}>
              <HiStar size={13} color="#f59e0b"/> <span style={{ fontSize:12, color:'var(--gray-600)', fontWeight:600 }}>{DOCTOR.rating}</span>
            </div>
          </div>
          <Button size="sm" variant="secondary" icon={<FiMessageSquare size={14}/>} onClick={() => navigate('/patient/messages')}>
            Message
          </Button>
        </div>
      </Card>

      {/* Today's Exercises */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <h3 style={{ fontSize:17, fontWeight:700 }}>Today's Exercises</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/patient/tracker')}>See All</Button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--gray-500)' }}>Loading exercises...</div>
          ) : exercises.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--gray-500)' }}>No exercises assigned yet.</div>
          ) : (
            exercises.map((ex, i) => (
              <Card key={ex._id} style={{ borderRight:`3px solid #10b981`, padding:'14px 16px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:22 }}>💪</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:14 }}>{ex.title}</div>
                    <div style={{ fontSize:12, color:'var(--gray-500)', marginTop:2 }}>{ex.durationMinutes} mins · {ex.difficulty}</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'flex-end' }}>
                    <Button size="sm" style={{ background:'#10b981', color:'#fff', border:'none' }} onClick={() => navigate('/patient/tracker')}>Start</Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
