import { MOCK_PATIENTS, STATUS_CONFIG, INJURY_LABELS } from '../../data/mockData';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';

function Bar({ label, value, max, color }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      <span style={{ fontSize:13, color:'var(--gray-600)', minWidth:80 }}>{label}</span>
      <div style={{ flex:1, height:8, background:'var(--gray-100)', borderRadius:4, overflow:'hidden' }}>
        <div style={{ width:`${(value/max)*100}%`, height:'100%', background:color, borderRadius:4, transition:'width .5s' }}/>
      </div>
      <span style={{ fontSize:13, fontWeight:700, color:'var(--gray-900)', minWidth:24 }}>{value}</span>
    </div>
  );
}

function Ring({ pct, color='var(--primary)', size=80 }) {
  const r=(size-8)/2, c=2*Math.PI*r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--gray-100)" strokeWidth="7"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={c} strokeDashoffset={c*(1-pct/100)} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{transition:'stroke-dashoffset .5s'}}/>
      <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="central" fontSize={size*.2} fontWeight="700" fill={color}>{pct}%</text>
    </svg>
  );
}

const WEEK = [
  {day:'Mon',sessions:3,avg:72},{day:'Tue',sessions:5,avg:78},{day:'Wed',sessions:4,avg:75},
  {day:'Thu',sessions:7,avg:82},{day:'Fri',sessions:6,avg:80},{day:'Sat',sessions:8,avg:88},{day:'Sun',sessions:2,avg:74},
];
const maxS = Math.max(...WEEK.map(d=>d.sessions));

export default function DoctorAnalytics() {
  const patients = MOCK_PATIENTS;
  const avgProgress = Math.round(patients.reduce((s,p)=>s+p.progress,0)/patients.length);
  const avgPain     = (patients.reduce((s,p)=>s+p.painLevel,0)/patients.length).toFixed(1);
  const completed   = patients.filter(p=>p.status==='completed').length;

  const injuryCounts = {};
  patients.forEach(p=>{ injuryCounts[p.injury]=(injuryCounts[p.injury]||0)+1; });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div>
        <h1 style={{ fontSize:24, fontWeight:800, color:'var(--gray-900)', margin:0 }}>Analytics</h1>
        <p style={{ color:'var(--gray-500)', marginTop:4 }}>Overview of patient outcomes and session trends.</p>
      </div>

      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
        {[
          { label:'Avg Progress', value:`${avgProgress}%`, color:'var(--primary)' },
          { label:'Avg Pain',     value:`${avgPain}/10`,   color:'#f59e0b' },
          { label:'Completed',    value:completed,          color:'#10b981' },
          { label:'Active',       value:patients.filter(p=>p.status==='inprogress').length, color:'#0ea5e9' },
        ].map(k=>(
          <Card key={k.label} style={{ padding:'20px', textAlign:'center' }}>
            <div style={{ fontSize:32, fontWeight:900, color:k.color }}>{k.value}</div>
            <div style={{ fontSize:13, color:'var(--gray-500)', marginTop:4 }}>{k.label}</div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Weekly sessions bar */}
        <Card style={{ padding:'24px' }}>
          <h3 style={{ fontWeight:700, fontSize:15, marginBottom:20 }}>Weekly Sessions</h3>
          <div style={{ display:'flex', gap:8, alignItems:'flex-end', height:140 }}>
            {WEEK.map((d,i)=>(
              <div key={d.day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{ width:'100%', background:i===5?'var(--primary)':'var(--primary-light)', borderRadius:'4px 4px 0 0', height:`${(d.sessions/maxS)*110}px`, transition:'height .4s' }}/>
                <span style={{ fontSize:10, color:'var(--gray-400)' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Patient outcomes rings */}
        <Card style={{ padding:'24px' }}>
          <h3 style={{ fontWeight:700, fontSize:15, marginBottom:20 }}>Patient Progress</h3>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center' }}>
            {patients.map(p=>{
              const st=STATUS_CONFIG[p.status];
              return (
                <div key={p.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                  <Ring pct={p.progress} color={st.color} size={68}/>
                  <span style={{ fontSize:11, fontWeight:600, color:'var(--gray-600)' }}>{p.name.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Injury distribution */}
        <Card style={{ padding:'24px' }}>
          <h3 style={{ fontWeight:700, fontSize:15, marginBottom:20 }}>Injury Distribution</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {Object.entries(injuryCounts).map(([inj,cnt])=>(
              <Bar key={inj} label={INJURY_LABELS[inj]||inj} value={cnt} max={patients.length}
                color={inj==='shoulder'?'#1a56db':inj==='knee'?'#10b981':inj==='neck'?'#db2777':'#f59e0b'}/>
            ))}
          </div>
        </Card>

        {/* Avg progress over time (static) */}
        <Card style={{ padding:'24px' }}>
          <h3 style={{ fontWeight:700, fontSize:15, marginBottom:20 }}>Avg Progress / Day</h3>
          <div style={{ display:'flex', gap:6, alignItems:'flex-end', height:140 }}>
            {WEEK.map((d,i)=>(
              <div key={d.day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{ width:'100%', background:i===5?'#10b981':'#dcfce7', borderRadius:'4px 4px 0 0', height:`${(d.avg/100)*110}px`, transition:'height .4s' }}/>
                <span style={{ fontSize:10, color:'var(--gray-400)' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
