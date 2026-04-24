import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiX, HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import { MOVEMENT_LIMITATIONS } from '../../data/mockData';
import Button from '../../components/ui/Button';

// ── Body hotspot definitions (relative positions on SVG body) ─
const BODY_HOTSPOTS = {
  front: [
    { id:'neck',          label:'Neck',          injury:'neck',     x:50,  y:13,  size:28 },
    { id:'left_shoulder', label:'L. Shoulder',   injury:'shoulder', x:28,  y:21,  size:26 },
    { id:'right_shoulder',label:'R. Shoulder',   injury:'shoulder', x:72,  y:21,  size:26 },
    { id:'left_elbow',    label:'L. Elbow',      injury:'shoulder', x:20,  y:38,  size:26 },
    { id:'right_elbow',   label:'R. Elbow',      injury:'shoulder', x:80,  y:38,  size:26 },
    { id:'chest',         label:'Chest',         injury:'back',     x:50,  y:27,  size:30 },
    { id:'abdomen',       label:'Abdomen',        injury:'back',     x:50,  y:38,  size:30 },
    { id:'left_hip',      label:'L. Hip',        injury:'back',     x:36,  y:50,  size:26 },
    { id:'right_hip',     label:'R. Hip',        injury:'back',     x:64,  y:50,  size:26 },
    { id:'left_knee',     label:'L. Knee',       injury:'knee',     x:38,  y:68,  size:26 },
    { id:'right_knee',    label:'R. Knee',       injury:'knee',     x:62,  y:68,  size:26 },
    { id:'left_ankle',    label:'L. Ankle',      injury:'knee',     x:38,  y:86,  size:24 },
    { id:'right_ankle',   label:'R. Ankle',      injury:'knee',     x:62,  y:86,  size:24 },
  ],
  back: [
    { id:'upper_back',    label:'Upper Back',    injury:'back',     x:50,  y:24,  size:34 },
    { id:'lower_back',    label:'Lower Back',    injury:'back',     x:50,  y:38,  size:30 },
    { id:'left_glute',    label:'L. Glute',      injury:'back',     x:36,  y:50,  size:26 },
    { id:'right_glute',   label:'R. Glute',      injury:'back',     x:64,  y:50,  size:26 },
    { id:'left_hamstring',label:'L. Hamstring',  injury:'knee',     x:38,  y:62,  size:26 },
    { id:'right_hamstring',label:'R. Hamstring', injury:'knee',     x:62,  y:62,  size:26 },
    { id:'left_calf',     label:'L. Calf',       injury:'knee',     x:38,  y:76,  size:24 },
    { id:'right_calf',    label:'R. Calf',       injury:'knee',     x:62,  y:76,  size:24 },
  ],
};

// ── Simplified SVG Body Outline ───────────────────────────────
function BodySVG({ view }) {
  if (view === 'front') return (
    <svg viewBox="0 0 200 500" style={{ width:'100%', height:'100%', opacity:.25 }}>
      {/* Head */}
      <ellipse cx="100" cy="35" rx="26" ry="32" fill="#9ca3af"/>
      {/* Neck */}
      <rect x="90" y="65" width="20" height="18" rx="4" fill="#9ca3af"/>
      {/* Torso */}
      <path d="M55 82 Q45 90 42 130 L42 230 Q42 240 60 242 L140 242 Q158 240 158 230 L158 130 Q155 90 145 82 Z" fill="#9ca3af"/>
      {/* Left arm */}
      <path d="M55 85 Q35 100 28 150 Q24 180 26 210 L34 210 Q36 180 40 150 Q46 108 60 92 Z" fill="#9ca3af"/>
      {/* Right arm */}
      <path d="M145 85 Q165 100 172 150 Q176 180 174 210 L166 210 Q164 180 160 150 Q154 108 140 92 Z" fill="#9ca3af"/>
      {/* Left leg */}
      <path d="M60 242 Q55 280 56 340 Q56 380 58 420 L76 420 Q74 380 74 340 Q74 280 76 242 Z" fill="#9ca3af"/>
      {/* Right leg */}
      <path d="M140 242 Q145 280 144 340 Q144 380 142 420 L124 420 Q126 380 126 340 Q126 280 124 242 Z" fill="#9ca3af"/>
      {/* Feet */}
      <ellipse cx="66" cy="430" rx="14" ry="8" fill="#9ca3af"/>
      <ellipse cx="134" cy="430" rx="14" ry="8" fill="#9ca3af"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 200 500" style={{ width:'100%', height:'100%', opacity:.25 }}>
      <ellipse cx="100" cy="35" rx="26" ry="32" fill="#9ca3af"/>
      <rect x="90" y="65" width="20" height="18" rx="4" fill="#9ca3af"/>
      <path d="M55 82 Q45 90 42 130 L42 230 Q42 240 60 242 L140 242 Q158 240 158 230 L158 130 Q155 90 145 82 Z" fill="#9ca3af"/>
      <path d="M55 85 Q35 100 28 150 Q24 180 26 210 L34 210 Q36 180 40 150 Q46 108 60 92 Z" fill="#9ca3af"/>
      <path d="M145 85 Q165 100 172 150 Q176 180 174 210 L166 210 Q164 180 160 150 Q154 108 140 92 Z" fill="#9ca3af"/>
      <path d="M60 242 Q55 280 56 340 Q56 380 58 420 L76 420 Q74 380 74 340 Q74 280 76 242 Z" fill="#9ca3af"/>
      <path d="M140 242 Q145 280 144 340 Q144 380 142 420 L124 420 Q126 380 126 340 Q126 280 124 242 Z" fill="#9ca3af"/>
      <ellipse cx="66" cy="430" rx="14" ry="8" fill="#9ca3af"/>
      <ellipse cx="134" cy="430" rx="14" ry="8" fill="#9ca3af"/>
    </svg>
  );
}

export default function PainMap() {
  const navigate = useNavigate();
  const [view,        setView]        = useState('front');
  const [selected,    setSelected]    = useState([]);    // array of hotspot ids
  const [painLevel,   setPainLevel]   = useState(5);
  const [limitations, setLimitations] = useState([]);

  const hotspots = BODY_HOTSPOTS[view];

  function toggleHotspot(spot) {
    setSelected(prev =>
      prev.find(s => s.id === spot.id)
        ? prev.filter(s => s.id !== spot.id)
        : [...prev, spot]
    );
  }

  function toggleLimitation(item) {
    setLimitations(prev =>
      prev.includes(item) ? prev.filter(l => l !== item) : [...prev, item]
    );
  }

  function handleNext() {
    if (selected.length === 0) return;
    // determine primary injury from most-selected injury type
    const counts = {};
    selected.forEach(s => { counts[s.injury] = (counts[s.injury] || 0) + 1; });
    const primaryInjury = Object.entries(counts).sort((a,b) => b[1]-a[1])[0]?.[0] || 'shoulder';
    navigate(`/patient/doctors?injury=${primaryInjury}&pain=${painLevel}`);
  }

  const painColor = painLevel <= 3 ? '#10b981' : painLevel <= 6 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ minHeight:'100vh', background:'var(--gray-50)', padding:'24px' }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:12, color:'var(--gray-500)', marginBottom:6 }}>
          ASSESSMENTS › <span style={{ color:'var(--primary)', fontWeight:600 }}>PAIN MAP</span>
        </div>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:800, color:'var(--gray-900)', marginBottom:6 }}>Smart Pain Assessment</h1>
            <p style={{ color:'var(--gray-500)', fontSize:15 }}>Identify your pain locations and severity for a tailored recovery plan.</p>
          </div>
          {/* Step indicator */}
          <div style={{ display:'flex', alignItems:'center', gap:10, background:'#fff', border:'1px solid var(--gray-200)', borderRadius:'var(--radius-full)', padding:'8px 20px', flexShrink:0 }}>
            <span style={{ fontSize:13, color:'var(--gray-600)' }}>Step 2 of 4</span>
            <div style={{ width:80, height:4, background:'var(--gray-200)', borderRadius:2 }}>
              <div style={{ width:'50%', height:'100%', background:'var(--primary)', borderRadius:2 }}/>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, maxWidth:1100 }}>

        {/* LEFT: Body Map */}
        <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:'var(--radius-lg)', padding:'20px', boxShadow:'var(--shadow-sm)' }}>
          {/* View toggle */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ display:'flex', background:'var(--gray-100)', borderRadius:'var(--radius-md)', padding:3, gap:2 }}>
              {['front','back'].map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding:'7px 18px', border:'none', borderRadius:'var(--radius-sm)',
                  fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .15s',
                  background: view === v ? '#fff' : 'transparent',
                  color: view === v ? 'var(--gray-900)' : 'var(--gray-500)',
                  boxShadow: view === v ? 'var(--shadow-sm)' : 'none',
                }}>
                  {v === 'front' ? 'Front View' : 'Back View'}
                </button>
              ))}
            </div>
            <button onClick={() => setSelected([])} style={{ display:'flex', alignItems:'center', gap:6, border:'none', background:'none', color:'var(--gray-500)', fontSize:13, cursor:'pointer' }}>
              ↺ Clear Selection
            </button>
          </div>

          {/* Body with hotspots */}
          <div style={{ position:'relative', height:480, userSelect:'none' }}>
            <div style={{ position:'absolute', inset:0, display:'flex', justifyContent:'center' }}>
              <div style={{ width:200, height:'100%' }}>
                <BodySVG view={view} />
              </div>
            </div>

            {/* Clickable hotspot bubbles */}
            {hotspots.map(spot => {
              const isSelected = selected.find(s => s.id === spot.id);
              return (
                <button key={spot.id} onClick={() => toggleHotspot(spot)} style={{
                  position:'absolute',
                  left:  `${spot.x}%`,
                  top:   `${spot.y}%`,
                  transform: 'translate(-50%,-50%)',
                  width:  spot.size, height: spot.size,
                  borderRadius:'50%',
                  border: `2px solid ${isSelected ? 'var(--primary)' : 'rgba(26,86,219,.3)'}`,
                  background: isSelected ? 'var(--primary)' : 'rgba(26,86,219,.08)',
                  cursor:'pointer', transition:'all .15s',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow: isSelected ? '0 0 0 4px rgba(26,86,219,.2)' : 'none',
                  zIndex:10,
                }}>
                  {isSelected && (
                    <div style={{ position:'absolute', top:-22, left:'50%', transform:'translateX(-50%)', background:'var(--primary)', color:'#fff', borderRadius:4, padding:'2px 6px', fontSize:10, fontWeight:600, whiteSpace:'nowrap' }}>
                      {spot.label}
                    </div>
                  )}
                  <div style={{ width:8, height:8, borderRadius:'50%', background: isSelected ? '#fff' : 'var(--primary)', opacity: isSelected ? 1 : .5 }}/>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display:'flex', gap:20, marginTop:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--gray-600)' }}>
              <div style={{ width:12, height:12, borderRadius:'50%', background:'var(--primary)' }}/> Selected Area
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--gray-600)' }}>
              <div style={{ width:12, height:12, borderRadius:'50%', background:'var(--gray-200)' }}/> No Pain
            </div>
          </div>
        </div>

        {/* RIGHT: Assessment Form */}
        <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:'var(--radius-lg)', padding:'24px', boxShadow:'var(--shadow-sm)', display:'flex', flexDirection:'column', gap:28 }}>

          {/* 1. Selected Areas */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0 }}>1</div>
              <h3 style={{ fontSize:17, fontWeight:700 }}>Selected Areas</h3>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {selected.length === 0 && (
                <span style={{ fontSize:13, color:'var(--gray-400)', fontStyle:'italic' }}>Click on the body map to select pain areas</span>
              )}
              {selected.map(s => (
                <span key={s.id} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--primary-light)', color:'var(--primary)', borderRadius:'var(--radius-full)', padding:'5px 12px', fontSize:13, fontWeight:600 }}>
                  {s.label}
                  <button onClick={() => toggleHotspot(s)} style={{ border:'none', background:'none', cursor:'pointer', color:'var(--primary)', display:'flex', padding:0, lineHeight:1 }}>
                    <HiX size={14}/>
                  </button>
                </span>
              ))}
              {selected.length > 0 && (
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:'var(--gray-100)', color:'var(--gray-500)', borderRadius:'var(--radius-full)', padding:'5px 12px', fontSize:13, cursor:'pointer' }}>
                  + Add more on map
                </span>
              )}
            </div>
          </div>

          {/* 2. Pain Severity */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0 }}>2</div>
                <h3 style={{ fontSize:17, fontWeight:700 }}>Pain Severity</h3>
              </div>
              <span style={{ fontSize:24, fontWeight:900, color:painColor }}>{painLevel}/10</span>
            </div>
            <input type="range" min="1" max="10" value={painLevel}
              onChange={e => setPainLevel(Number(e.target.value))}
              style={{ width:'100%', accentColor:'var(--primary)', height:4, marginBottom:10 }}
            />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--gray-400)' }}>
              <div><div style={{ fontWeight:600 }}>MILD</div><div>1</div></div>
              <div style={{ textAlign:'center' }}><div style={{ fontWeight:600 }}>MODERATE</div><div>5</div></div>
              <div style={{ textAlign:'right' }}><div style={{ fontWeight:600 }}>SEVERE</div><div>10</div></div>
            </div>
          </div>

          {/* 3. Movement Limitations */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0 }}>3</div>
              <h3 style={{ fontSize:17, fontWeight:700 }}>Movement Limitations</h3>
            </div>
            <p style={{ fontSize:13, color:'var(--gray-500)', marginBottom:14, marginRight:38 }}>Which activities are currently difficult?</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {MOVEMENT_LIMITATIONS.map(item => {
                const checked = limitations.includes(item);
                return (
                  <button key={item} onClick={() => toggleLimitation(item)} style={{
                    display:'flex', alignItems:'center', gap:10,
                    padding:'12px 14px', border:`1.5px solid ${checked ? 'var(--primary)' : 'var(--gray-200)'}`,
                    borderRadius:'var(--radius-md)', background: checked ? 'var(--primary-light)' : '#fff',
                    cursor:'pointer', textAlign:'left', transition:'all .15s', fontSize:13, fontWeight:500,
                    color: checked ? 'var(--primary)' : 'var(--gray-700)',
                  }}>
                    <div style={{
                      width:18, height:18, borderRadius:4, flexShrink:0,
                      border:`2px solid ${checked ? 'var(--primary)' : 'var(--gray-300)'}`,
                      background: checked ? 'var(--primary)' : '#fff',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      {checked && <span style={{ color:'#fff', fontSize:11, fontWeight:700 }}>✓</span>}
                    </div>
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'auto', paddingTop:8, borderTop:'1px solid var(--gray-100)' }}>
            <Button variant="ghost" icon={<HiArrowLeft/>} onClick={() => navigate('/patient/chat')}>
              Back
            </Button>
            <Button disabled={selected.length === 0} iconRight={<HiArrowRight/>} onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ marginTop:20, padding:'14px 20px', background:'var(--gray-100)', borderRadius:'var(--radius-md)', fontSize:13, color:'var(--gray-600)', display:'flex', gap:10, alignItems:'flex-start', maxWidth:1100 }}>
        <span style={{ flexShrink:0, marginTop:1 }}>ℹ</span>
        <span><strong>Medical Disclaimer:</strong> This smart pain assessment tool is for informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.</span>
      </div>
    </div>
  );
}
