import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUsers, HiCheckCircle, HiTrendingUp, HiClock } from 'react-icons/hi';
import { FiActivity } from 'react-icons/fi';
import { STATUS_CONFIG, INJURY_LABELS } from '../../data/mockData';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ icon, value, label, trend, color }) {
  return (
    <Card style={{ padding:'24px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
        <div style={{ width:44, height:44, borderRadius:'var(--radius-md)', background:color+'18', color, display:'flex', alignItems:'center', justifyContent:'center' }}>{icon}</div>
        {trend && <span style={{ fontSize:12, fontWeight:600, color:'var(--success)', background:'#ecfdf5', padding:'3px 8px', borderRadius:'var(--radius-full)' }}>{trend}</span>}
      </div>
      <div style={{ fontSize:36, fontWeight:900, color:'var(--gray-900)', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:14, color:'var(--gray-500)', marginTop:6 }}>{label}</div>
    </Card>
  );
}

// ── Progress ring ─────────────────────────────────────────────
function Ring({ pct, color, size=60 }) {
  const r = (size-8)/2;
  const c = 2*Math.PI*r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--gray-100)" strokeWidth="6"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={c} strokeDashoffset={c*(1-pct/100)} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition:'stroke-dashoffset .5s' }}/>
      <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="central" fontSize={size*.18} fontWeight="700" fill={color}>{pct}%</text>
    </svg>
  );
}

// ── Weekly bar chart (static) ─────────────────────────────────
function WeekChart() {
  const data = [3,5,4,7,6,8,5];
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const max  = Math.max(...data);
  return (
    <div style={{ display:'flex', gap:8, alignItems:'flex-end', height:120 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
          <div style={{ width:'100%', background:i===5?'var(--primary)':'var(--primary-light)', borderRadius:'4px 4px 0 0', height:`${(v/max)*90}px`, transition:'height .4s' }}/>
          <span style={{ fontSize:10, color:'var(--gray-400)' }}>{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({ totalPatients: 0, activePlans: 0, todayAppointments: 0, unreadMessages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statRes, patRes] = await Promise.all([
          fetch('/api/doctor/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/doctor/patients', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (statRes.ok) setStats(await statRes.json());
        if (patRes.ok) setPatients(await patRes.json());
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const active   = patients.filter(p => p.status==='inprogress').length;
  const completed= patients.filter(p => p.status==='completed').length;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* Title */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'var(--gray-900)', margin:0 }}>Dashboard</h1>
          <p style={{ color:'var(--gray-500)', marginTop:4 }}>Welcome back, Dr. {user?.name?.split(' ')[1] || user?.name || 'Sarah'}. Here's your overview.</p>
        </div>
        <Badge color="var(--success)" bg="#ecfdf5" size="md">● Live</Badge>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
        <StatCard icon={<HiUsers size={20}/>}        value={stats.totalPatients} label="Total Patients"   color="var(--primary)"   trend="+2"/>
        <StatCard icon={<FiActivity size={20}/>}     value={stats.activePlans}   label="In Treatment"    color="#0ea5e9"/>
        <StatCard icon={<HiCheckCircle size={20}/>}  value={completed}           label="Completed"       color="var(--success)"   trend="+1"/>
        <StatCard icon={<HiClock size={20}/>}        value={stats.todayAppointments} label="Sessions Today"  color="var(--warning)"/>
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <Card style={{ padding:'24px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:16 }}>Weekly Sessions</div>
          <WeekChart/>
        </Card>
        <Card style={{ padding:'24px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:16 }}>Patient Outcomes</div>
          <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
            {patients.map(p => {
              const st = STATUS_CONFIG[p.status];
              return (
                <div key={p.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                  <Ring pct={p.progress} color={st.color} size={64}/>
                  <div style={{ fontSize:11, fontWeight:600, color:'var(--gray-600)' }}>{p.name.split(' ')[0]}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Patients table */}
      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-100)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ fontWeight:700, fontSize:16 }}>My Patients</h3>
          <Button size="sm" onClick={() => navigate('/doctor/patients')}>View All</Button>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'var(--gray-50)', borderBottom:'1px solid var(--gray-100)' }}>
              {['Patient','Injury','Progress','Pain','Status','Last Seen',''].map(h => (
                <th key={h} style={{ padding:'12px 20px', fontSize:12, fontWeight:700, color:'var(--gray-500)', textAlign:'left', letterSpacing:.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.map((p, i) => {
              const st = STATUS_CONFIG[p.status];
              const painColor = p.painLevel<=3?'var(--success)':p.painLevel<=6?'var(--warning)':'var(--danger)';
              return (
                <tr key={p.id} style={{ borderBottom:i<patients.length-1?'1px solid var(--gray-100)':'none', transition:'background .1s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--gray-50)'}
                  onMouseLeave={e=>e.currentTarget.style.background='#fff'}
                >
                  <td style={{ padding:'16px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <Avatar initials={p.avatar} size={36}/>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14 }}>{p.name}</div>
                        <div style={{ fontSize:12, color:'var(--gray-500)' }}>Age {p.age}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'16px 20px', fontSize:13 }}>{INJURY_LABELS[p.injury]}</td>
                  <td style={{ padding:'16px 20px', minWidth:140 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ flex:1, height:5, background:'var(--gray-100)', borderRadius:3, overflow:'hidden' }}>
                        <div style={{ width:`${p.progress}%`, height:'100%', background:p.status==='completed'?'var(--success)':'var(--primary)', borderRadius:3 }}/>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:'var(--primary)', minWidth:32 }}>{p.progress}%</span>
                    </div>
                    <div style={{ fontSize:11, color:'var(--gray-400)', marginTop:3 }}>{p.sessions}/{p.totalSessions} sessions</div>
                  </td>
                  <td style={{ padding:'16px 20px' }}>
                    <span style={{ fontWeight:700, fontSize:14, color:painColor }}>{p.painLevel}<span style={{ fontSize:11, fontWeight:400, color:'var(--gray-400)'}}>/10</span></span>
                  </td>
                  <td style={{ padding:'16px 20px' }}>
                    <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
                  </td>
                  <td style={{ padding:'16px 20px', fontSize:13, color:'var(--gray-500)' }}>{p.lastSeen}</td>
                  <td style={{ padding:'16px 20px' }}>
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/doctor/patient/${p.id}`)}>View</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
