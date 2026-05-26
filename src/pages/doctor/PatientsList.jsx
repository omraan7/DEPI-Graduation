import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiFilter } from 'react-icons/hi';
import { STATUS_CONFIG, INJURY_LABELS } from '../../data/mockData';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';

export default function PatientsList() {
  const navigate   = useNavigate();
  const { token }  = useContext(AuthContext);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');
  const [patients, setPatients] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await fetch('/api/doctor/patients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setPatients(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch patients', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, [token]);

  const filtered = patients.filter(p => {
    const matchS = p.name.toLowerCase().includes(search.toLowerCase()) || INJURY_LABELS[p.injury]?.toLowerCase().includes(search.toLowerCase());
    const matchF = filter === 'all' || p.status === filter;
    return matchS && matchF;
  });

  const filters = [
    { id:'all',        label:'All' },
    { id:'inprogress', label:'In Progress' },
    { id:'completed',  label:'Completed' },
    { id:'notstarted', label:'Not Started' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'var(--gray-900)', margin:0 }}>Patients</h1>
          <p style={{ color:'var(--gray-500)', marginTop:4 }}>{patients.length} total patients</p>
        </div>
        <Button>+ Add Patient</Button>
      </div>

      {/* Search & filters */}
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:'1 1 280px' }}>
          <HiSearch size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--gray-400)' }}/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search patients or injuries..."
            style={{ width:'100%', padding:'10px 14px 10px 36px', border:'1px solid var(--gray-200)', borderRadius:'var(--radius-md)', fontSize:14, outline:'none', fontFamily:'inherit', color:'var(--gray-800)' }}
          />
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding:'8px 16px', borderRadius:'var(--radius-full)', fontSize:13, fontWeight:600, cursor:'pointer',
              border:`1.5px solid ${filter===f.id ? 'var(--primary)' : 'var(--gray-200)'}`,
              background: filter===f.id ? 'var(--primary)' : '#fff',
              color:       filter===f.id ? '#fff' : 'var(--gray-600)',
              transition:'all .15s',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card style={{ padding:0, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'var(--gray-50)', borderBottom:'1px solid var(--gray-100)' }}>
              {['Patient','Injury','Sessions','Progress','Pain','Status','Last Seen','Action'].map(h => (
                <th key={h} style={{ padding:'12px 20px', fontSize:12, fontWeight:700, color:'var(--gray-500)', textAlign:'left', letterSpacing:.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const st = STATUS_CONFIG[p.status];
              const painColor = p.painLevel<=3?'#10b981':p.painLevel<=6?'#f59e0b':'#ef4444';
              return (
                <tr key={p.id} style={{ borderBottom:i<filtered.length-1?'1px solid var(--gray-100)':'none' }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--gray-50)'}
                  onMouseLeave={e => e.currentTarget.style.background='#fff'}
                >
                  <td style={{ padding:'16px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <Avatar initials={p.avatar} size={36}/>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14 }}>{p.name}</div>
                        <div style={{ fontSize:11, color:'var(--gray-400)' }}>Age {p.age}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'16px 20px', fontSize:13 }}>{INJURY_LABELS[p.injury]}</td>
                  <td style={{ padding:'16px 20px', fontSize:13 }}>{p.sessions}/{p.totalSessions}</td>
                  <td style={{ padding:'16px 20px', minWidth:130 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ flex:1, height:5, background:'var(--gray-100)', borderRadius:3, overflow:'hidden' }}>
                        <div style={{ width:`${p.progress}%`, height:'100%', background:p.status==='completed'?'#10b981':'var(--primary)', borderRadius:3 }}/>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:'var(--primary)', minWidth:32 }}>{p.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding:'16px 20px' }}>
                    <span style={{ fontWeight:700, fontSize:14, color:painColor }}>{p.painLevel}<span style={{ fontSize:11, color:'var(--gray-400)', fontWeight:400 }}>/10</span></span>
                  </td>
                  <td style={{ padding:'16px 20px' }}>
                    <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
                  </td>
                  <td style={{ padding:'16px 20px', fontSize:13, color:'var(--gray-400)' }}>{p.lastSeen}</td>
                  <td style={{ padding:'16px 20px' }}>
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/doctor/patient/${p.id}`)}>View</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding:'48px', textAlign:'center', color:'var(--gray-400)' }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
            <p>No patients found matching your search.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
