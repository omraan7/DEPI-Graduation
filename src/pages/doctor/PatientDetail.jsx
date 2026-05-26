import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { HiArrowLeft, HiPencil, HiSave } from 'react-icons/hi';
import { STATUS_CONFIG, INJURY_LABELS, EXERCISES_BY_INJURY } from '../../data/mockData';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';

function Ring({ pct, color, size=80 }) {
  const r = (size-8)/2, c = 2*Math.PI*r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--gray-100)" strokeWidth="7"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={c} strokeDashoffset={c*(1-pct/100)} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}/>
      <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="central" fontSize={size*.2} fontWeight="700" fill={color}>{pct}%</text>
    </svg>
  );
}

export default function PatientDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { token }  = useContext(AuthContext);
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState('Patient progressing well. Continue with current exercise plan. Monitor shoulder elevation angles closely.');
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/doctor/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch patient details', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id, token]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading details...</div>;
  if (!data) return <div style={{ padding: 40, textAlign: 'center' }}>Patient not found</div>;

  const { patient, plans, sessionLogs } = data;
  const st         = STATUS_CONFIG[patient.status] || STATUS_CONFIG['inprogress'];
  
  // Try to use the active plan's exercises, otherwise fallback to mock
  let exercises = [];
  if (plans && plans.length > 0 && plans[0].exercises) {
    exercises = plans[0].exercises.map(e => ({
      key: e.exercise._id,
      nameEn: e.exercise.title,
      descEn: e.exercise.description,
      target: 180, // placeholder
      icon: '💪',
      color: '#10b981'
    }));
  } else {
    exercises = EXERCISES_BY_INJURY[patient.injury] || [];
  }

  const TABS = ['overview','exercises','history','notes'];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Back + Header */}
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <Button variant="ghost" size="sm" icon={<HiArrowLeft/>} onClick={() => navigate('/doctor/dashboard')}>Back</Button>
        <Avatar initials={patient.avatar} size={52}/>
        <div style={{ flex:1 }}>
          <h2 style={{ fontSize:22, fontWeight:800, margin:0 }}>{patient.name}</h2>
          <div style={{ fontSize:14, color:'var(--gray-500)', marginTop:2 }}>{INJURY_LABELS[patient.injury]} Injury · Age {patient.age}</div>
        </div>
        <Badge color={st.color} bg={st.bg} size="md">{st.label}</Badge>
      </div>

      {/* Quick stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
        <Card style={{ padding:'16px', textAlign:'center' }}>
          <Ring pct={patient.progress} color={st.color}/>
          <div style={{ fontSize:12, color:'var(--gray-500)', marginTop:8 }}>Overall Progress</div>
        </Card>
        <Card style={{ padding:'16px', textAlign:'center' }}>
          <div style={{ fontSize:36, fontWeight:900, color:patient.painLevel<=3?'var(--success)':patient.painLevel<=6?'var(--warning)':'var(--danger)', lineHeight:1 }}>{patient.painLevel}</div>
          <div style={{ fontSize:12, color:'var(--gray-500)', marginTop:4 }}>Pain Level</div>
          <div style={{ height:4, background:'var(--gray-100)', borderRadius:2, marginTop:10, overflow:'hidden' }}>
            <div style={{ width:`${patient.painLevel*10}%`, height:'100%', background:patient.painLevel<=3?'var(--success)':patient.painLevel<=6?'var(--warning)':'var(--danger)', borderRadius:2 }}/>
          </div>
        </Card>
        <Card style={{ padding:'16px', textAlign:'center' }}>
          <div style={{ fontSize:36, fontWeight:900, color:'var(--primary)', lineHeight:1 }}>{patient.sessions}</div>
          <div style={{ fontSize:12, color:'var(--gray-500)', marginTop:4 }}>Sessions Done</div>
          <div style={{ fontSize:11, color:'var(--gray-400)', marginTop:4 }}>of {patient.totalSessions} total</div>
        </Card>
        <Card style={{ padding:'16px', textAlign:'center' }}>
          <div style={{ fontSize:36, fontWeight:900, color:'var(--warning)', lineHeight:1 }}>87°</div>
          <div style={{ fontSize:12, color:'var(--gray-500)', marginTop:4 }}>Best Angle</div>
          <div style={{ fontSize:11, color:'var(--gray-400)', marginTop:4 }}>Last session</div>
        </Card>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, borderBottom:'2px solid var(--gray-100)', paddingBottom:0 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'10px 20px', border:'none', background:'transparent', cursor:'pointer',
            fontSize:14, fontWeight:tab===t?700:400, color:tab===t?'var(--primary)':'var(--gray-500)',
            borderBottom:`2px solid ${tab===t?'var(--primary)':'transparent'}`, marginBottom:-2, transition:'all .15s',
          }}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <Card style={{ padding:'20px' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:14 }}>Patient Info</div>
            {[['Injury',INJURY_LABELS[patient.injury]],['Status',patient.status],['Sessions',`${patient.sessions}/${patient.totalSessions}`],['Last Seen',patient.lastSeen]].map(([l,v]) => (
              <div key={l} style={{ display:'flex', padding:'10px 0', borderBottom:'1px solid var(--gray-50)' }}>
                <span style={{ flex:1, color:'var(--gray-500)', fontSize:13 }}>{l}</span>
                <span style={{ fontWeight:600, fontSize:13 }}>{v}</span>
              </div>
            ))}
          </Card>
          <Card style={{ padding:'20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--gray-400)', letterSpacing:1.5, textTransform:'uppercase' }}>Doctor Notes</div>
              <Button size="sm" variant="ghost" icon={editing ? <HiSave/> : <HiPencil/>} onClick={() => setEditing(!editing)}>
                {editing ? 'Save' : 'Edit'}
              </Button>
            </div>
            {editing
              ? <textarea value={notes} onChange={e=>setNotes(e.target.value)} style={{ width:'100%', minHeight:120, border:'1px solid var(--gray-200)', borderRadius:'var(--radius-md)', padding:12, fontSize:14, fontFamily:'inherit', resize:'vertical', outline:'none' }}/>
              : <p style={{ fontSize:14, color:'var(--gray-700)', lineHeight:1.7, margin:0 }}>{notes}</p>
            }
          </Card>
        </div>
      )}

      {tab === 'exercises' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
          {exercises.map(ex => (
            <Card key={ex.key} style={{ borderLeft:`4px solid ${ex.color}`, padding:'18px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:20 }}>{ex.icon}</span>
                    <div style={{ fontWeight:700, fontSize:15 }}>{ex.nameEn}</div>
                  </div>
                  <div style={{ fontSize:12, color:'var(--gray-500)' }}>{ex.descEn}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <Badge color={ex.color} size="sm">{ex.target}° target</Badge>
                <Badge color="var(--success)" bg="#ecfdf5" size="sm">10 reps</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'history' && (
        <Card style={{ padding:0, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'var(--gray-50)', borderBottom:'1px solid var(--gray-100)' }}>
                {['Date','Exercise','Reps','Angle','Pain','Duration'].map(h => (
                  <th key={h} style={{ padding:'12px 20px', fontSize:12, fontWeight:700, color:'var(--gray-500)', textAlign:'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessionLogs && sessionLogs.length > 0 ? sessionLogs.map((log) => (
                <tr key={log._id} style={{ borderBottom:'1px solid var(--gray-100)' }}>
                  <td style={{ padding:'14px 20px', fontSize:13 }}>{new Date(log.createdAt).toLocaleDateString('en-US', {month:'short', day:'numeric'})}</td>
                  <td style={{ padding:'14px 20px', fontSize:13, fontWeight:500 }}>{log.exerciseName || log.exercise?.title}</td>
                  <td style={{ padding:'14px 20px', fontSize:13 }}>{log.repsCompleted}</td>
                  <td style={{ padding:'14px 20px', fontSize:13, fontWeight:700, color:'var(--primary)' }}>{log.maxAngle}°</td>
                  <td style={{ padding:'14px 20px', fontSize:13, color:(log.painLevelAfter||5)<=4?'var(--success)':(log.painLevelAfter||5)<=6?'var(--warning)':'var(--danger)', fontWeight:700 }}>{log.painLevelAfter || '-'}/10</td>
                  <td style={{ padding:'14px 20px', fontSize:13, color:'var(--gray-500)' }}>{log.durationMinutes} min</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ padding:'40px 20px', textAlign:'center', color:'var(--gray-500)' }}>No session history recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'notes' && (
        <Card style={{ padding:'24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <h3 style={{ fontWeight:700, fontSize:16 }}>Clinical Notes</h3>
            <Button size="sm" icon={editing?<HiSave/>:<HiPencil/>} onClick={() => setEditing(!editing)}>
              {editing ? 'Save' : 'Edit Notes'}
            </Button>
          </div>
          {editing
            ? <textarea value={notes} onChange={e=>setNotes(e.target.value)} style={{ width:'100%', minHeight:200, border:'1px solid var(--gray-200)', borderRadius:'var(--radius-md)', padding:16, fontSize:15, fontFamily:'inherit', resize:'vertical', outline:'none' }}/>
            : <p style={{ fontSize:15, color:'var(--gray-700)', lineHeight:1.8 }}>{notes}</p>
          }
        </Card>
      )}
    </div>
  );
}
