import { useNavigate } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { FiActivity, FiCalendar, FiTarget } from 'react-icons/fi';
import { EXERCISES_BY_INJURY } from '../../data/mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';

const PATIENT = { name:'Ahmed Mohamed', age:34, phone:'+20 101 234 5678', email:'ahmed@email.com', injury:'shoulder', avatar:'AM', joinDate:'Jan 2025' };

function Ring({ pct, color='var(--primary)', size=72 }) {
  const r = (size-7)/2, c = 2*Math.PI*r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--gray-100)" strokeWidth="6"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={c} strokeDashoffset={c*(1-pct/100)} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition:'stroke-dashoffset .5s' }}/>
      <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="central" fontSize={size*.2} fontWeight="700" fill={color}>{pct}%</text>
    </svg>
  );
}

const SESSION_HISTORY = [
  { date:'Apr 15', ex:'Shoulder Abduction', reps:10, angle:'87°', pain:5, color:'#1a56db' },
  { date:'Apr 13', ex:'Shoulder Flexion',   reps:8,  angle:'105°',pain:6, color:'#d97706' },
  { date:'Apr 11', ex:'Full Overhead',      reps:6,  angle:'142°',pain:7, color:'#7c3aed' },
  { date:'Apr 9',  ex:'Shoulder Abduction', reps:10, angle:'82°', pain:6, color:'#1a56db' },
];

export default function PatientProfile() {
  const navigate  = useNavigate();
  const exercises = EXERCISES_BY_INJURY[PATIENT.injury] || [];

  return (
    <div style={{ padding:20, display:'flex', flexDirection:'column', gap:20, paddingBottom:32 }}>

      {/* Profile card */}
      <Card style={{ padding:'24px' }}>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <Avatar initials={PATIENT.avatar} size={64} style={{ background:'var(--primary-light)' }}/>
          <div style={{ flex:1 }}>
            <h2 style={{ fontSize:20, fontWeight:800, color:'var(--gray-900)', margin:0 }}>{PATIENT.name}</h2>
            <p style={{ fontSize:13, color:'var(--gray-500)', marginTop:2 }}>Age {PATIENT.age} · Member since {PATIENT.joinDate}</p>
            <p style={{ fontSize:13, color:'var(--gray-500)' }}>{PATIENT.phone}</p>
          </div>
          <Button variant="ghost" size="sm">Edit</Button>
        </div>
      </Card>

      {/* Overall progress */}
      <Card style={{ padding:'20px' }}>
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Recovery Progress</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <Ring pct={40} color="var(--primary)"/>
            <span style={{ fontSize:12, color:'var(--gray-500)', textAlign:'center' }}>Overall</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <Ring pct={65} color="#10b981"/>
            <span style={{ fontSize:12, color:'var(--gray-500)', textAlign:'center' }}>Mobility</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <Ring pct={30} color="#f59e0b"/>
            <span style={{ fontSize:12, color:'var(--gray-500)', textAlign:'center' }}>Strength</span>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {[
          { icon:<FiActivity size={18}/>, label:'Sessions',  val:8,   color:'var(--primary)' },
          { icon:<FiTarget size={18}/>,   label:'Exercises', val:24,  color:'#10b981' },
          { icon:<FiCalendar size={18}/>, label:'Streak',    val:'5d',color:'#f59e0b' },
        ].map(s => (
          <Card key={s.label} style={{ padding:'16px', textAlign:'center' }}>
            <div style={{ color:s.color, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontWeight:900, fontSize:22, color:'var(--gray-900)' }}>{s.val}</div>
            <div style={{ fontSize:11, color:'var(--gray-400)', marginTop:2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* My exercises */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <h3 style={{ fontWeight:700, fontSize:16, margin:0 }}>My Exercises</h3>
          <Button variant="ghost" size="sm" iconRight={<HiArrowRight size={14}/>} onClick={() => navigate('/patient/tracker')}>
            Start Session
          </Button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {exercises.map(ex => (
            <Card key={ex.key} style={{ padding:'14px 16px', borderLeft:`3px solid ${ex.color}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ fontSize:22 }}>{ex.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:14 }}>{ex.nameEn}</div>
                  <div style={{ fontSize:12, color:'var(--gray-500)', marginTop:2 }}>{ex.descEn}</div>
                </div>
                <div style={{ background:ex.color+'18', color:ex.color, borderRadius:'var(--radius-full)', padding:'3px 10px', fontSize:12, fontWeight:700 }}>
                  {ex.target}°
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Session history */}
      <div>
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:12 }}>Session History</h3>
        <Card style={{ padding:0, overflow:'hidden' }}>
          {SESSION_HISTORY.map((s, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
              borderBottom: i < SESSION_HISTORY.length-1 ? '1px solid var(--gray-50)' : 'none',
            }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:s.color, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13 }}>{s.ex}</div>
                <div style={{ fontSize:11, color:'var(--gray-400)', marginTop:1 }}>{s.date}</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <span style={{ background:s.color+'18', color:s.color, borderRadius:'var(--radius-sm)', padding:'2px 8px', fontSize:11, fontWeight:700 }}>↑ {s.angle}</span>
                <span style={{ background:'var(--gray-100)', color:'var(--gray-600)', borderRadius:'var(--radius-sm)', padding:'2px 8px', fontSize:11 }}>{s.reps} reps</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
