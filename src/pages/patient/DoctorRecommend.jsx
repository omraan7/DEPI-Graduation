import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HiStar, HiLocationMarker, HiClock, HiArrowLeft } from 'react-icons/hi';
import { FiAward } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';

function Stars({ n }) {
  return <span style={{ color:'#f59e0b', fontSize:13, letterSpacing:1 }}>{'★'.repeat(Math.round(n))}{'☆'.repeat(5-Math.round(n))}</span>;
}

function DoctorCard({ doctor, onSelect }) {
  return (
    <Card hover onClick={() => onSelect(doctor)} style={{ borderLeft:`4px solid ${doctor.color}`, padding:'20px' }}>
      <div style={{ display:'flex', gap:14 }}>
        <Avatar initials={doctor.avatar} color={doctor.color} size={54}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:16, color:'var(--gray-900)' }}>{doctor.name}</div>
              <div style={{ fontSize:13, color:'var(--gray-500)', marginTop:2 }}>{doctor.specialty}</div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontWeight:700, fontSize:15 }}>{doctor.price} EGP</div>
              <div style={{ fontSize:11, color:'var(--gray-400)' }}>/ session</div>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
            <Stars n={doctor.rating}/>
            <span style={{ fontSize:12, color:'var(--gray-500)' }}>{doctor.rating} ({doctor.reviews} reviews)</span>
          </div>

          <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:12 }}>
            <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'var(--gray-500)' }}>
              <HiLocationMarker size={13}/> {doctor.location}
            </span>
            <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'var(--gray-500)' }}>
              <FiAward size={13}/> {doctor.experience} yrs exp.
            </span>
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <Badge color={doctor.available ? '#10b981' : '#6b7280'} bg={doctor.available ? '#ecfdf5' : '#f3f4f6'}>
              {doctor.available ? '● Available' : '● Busy'}
            </Badge>
            <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'var(--gray-500)' }}>
              <HiClock size={13}/> Next: {doctor.nextSlot}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function DoctorRecommend() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const injury    = params.get('injury') || 'shoulder';
  const painLevel = params.get('pain') || '5';

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch('/api/patient/doctors', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Filter by injury if the backend returns all doctors
          const filtered = data.filter(d => 
            // In a real app, doctor.specialization might be matched. 
            // Here we just map injury directly or show all if specialization is missing.
            !d.specialization || d.specialization.toLowerCase().includes(injury)
          );
          setDoctors(filtered.length > 0 ? filtered : data); // fallback to all doctors if no match
        }
      } catch (err) {
        console.error('Failed to fetch doctors', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, [token, injury]);

  const INJURY_LABELS = { shoulder:'Shoulder', knee:'Knee', neck:'Neck', back:'Back' };

  return (
    <div style={{ minHeight:'100vh', background:'var(--gray-50)', paddingBottom:32 }}>
      {/* Header */}
      <div style={{ background:'#fff', borderBottom:'1px solid var(--gray-100)', padding:'16px 24px', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, maxWidth:800, margin:'0 auto' }}>
          <Button variant="ghost" size="sm" icon={<HiArrowLeft/>} onClick={() => navigate(-1)}>Back</Button>
          <div>
            <h1 style={{ fontSize:20, fontWeight:800 }}>Specialists for {INJURY_LABELS[injury] || injury}</h1>
            <p style={{ fontSize:13, color:'var(--gray-500)' }}>{doctors.length} doctors matched · Pain level: {painLevel}/10</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:800, margin:'0 auto', padding:'24px 20px' }}>
        {/* Info banner */}
        <div style={{ background:'var(--primary-light)', border:'1px solid #bfdbfe', borderRadius:'var(--radius-md)', padding:'12px 16px', fontSize:13, color:'#1e40af', marginBottom:20 }}>
          💡 These doctors are recommended based on your pain assessment. All are certified and vetted.
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--gray-500)' }}>Loading doctors...</div>
          ) : (
            <>
              {doctors.map(d => (
                <DoctorCard key={d._id} doctor={{
                  id: d._id,
                  name: `Dr. ${d.name}`,
                  specialty: d.specialization || 'Physiotherapist',
                  avatar: d.name.charAt(0).toUpperCase(),
                  color: '#10b981',
                  price: 400,
                  rating: d.rating || 5.0,
                  reviews: 24,
                  location: 'Cairo, EG',
                  experience: d.experience || 5,
                  available: true,
                  nextSlot: 'Tomorrow, 10:00 AM'
                }} onSelect={doc => navigate(`/patient/doctor/${doc.id}`)}/>
              ))}
              {doctors.length === 0 && (
                <Card style={{ textAlign:'center', padding:'48px 24px' }}>
                  <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
                  <h3 style={{ fontWeight:700, marginBottom:8 }}>No doctors available</h3>
                  <p style={{ color:'var(--gray-500)', fontSize:14 }}>No specialists found right now.</p>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
