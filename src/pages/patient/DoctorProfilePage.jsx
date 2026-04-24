import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiStar, HiLocationMarker, HiClock, HiCheckCircle } from 'react-icons/hi';
import { FiAward, FiMessageSquare } from 'react-icons/fi';
import { DOCTORS } from '../../data/mockData';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM',
];

function Stars({ n }) {
  return <span style={{ color: '#f59e0b', fontSize: 14, letterSpacing: 1 }}>{'★'.repeat(Math.round(n))}{'☆'.repeat(5 - Math.round(n))}</span>;
}

export default function DoctorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = DOCTORS.find(d => d.id === id) || DOCTORS[0];

  const [slot, setSlot] = useState(null);
  const [note, setNote] = useState('');
  const [booked, setBooked] = useState(false);

  function handleBook() {
    if (!slot) return;
    setBooked(true);
    setTimeout(() => navigate('/patient/home'), 2500);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', paddingBottom: 32 }}>
      {/* Colored header band */}
      <div style={{ background: doctor.color, height: 140, position: 'relative' }}>
        <button onClick={() => navigate(-1)} style={{
          position: 'absolute', top: 16, left: 16,
          background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: 'var(--radius-md)',
          padding: '8px 16px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <HiArrowLeft /> Back
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px' }}>
        {/* Avatar card overlapping header */}
        <Card style={{ marginTop: 50, padding: '24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <Avatar initials={doctor.avatar} color={doctor.color} size={80}
              style={{ border: `4px solid #fff`, boxShadow: 'var(--shadow-md)' }} />
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 4 }}>{doctor.name}</h1>
              <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 10 }}>{doctor.specialty}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Stars n={doctor.rating} />
                <span style={{ fontSize: 13, color: 'var(--gray-600)', fontWeight: 600 }}>{doctor.rating}</span>
                <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>({doctor.reviews} reviews)</span>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--gray-500)' }}>
                  <HiLocationMarker size={14} /> {doctor.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--gray-500)' }}>
                  <FiAward size={14} /> {doctor.experience} years experience
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--gray-900)' }}>{doctor.price} EGP</div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>per session</div>
              <Badge color={doctor.available ? '#10b981' : '#6b7280'} bg={doctor.available ? '#ecfdf5' : '#f3f4f6'} style={{ marginTop: 8 }}>
                {doctor.available ? '● Available Now' : '● Unavailable'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
          {[['🏅', 'Experience', `${doctor.experience} yrs`], ['👥', 'Sessions', `${doctor.sessions}+`], ['⭐', 'Rating', `${doctor.rating}/5`]].map(([ic, lbl, val]) => (
            <Card key={lbl} style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22 }}>{ic}</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--gray-900)', marginTop: 4 }}>{val}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>{lbl}</div>
            </Card>
          ))}
        </div>

        {/* Bio */}
        <Card style={{ padding: '20px', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>About</h3>
          <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.75 }}>{doctor.bio}</p>
        </Card>

        {/* Booking */}
        {!booked ? (
          <Card style={{ padding: '20px', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Book a Session</h3>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {TIME_SLOTS.map(s => (
                <button key={s} onClick={() => setSlot(s)} style={{
                  padding: '8px 14px', borderRadius: 'var(--radius-full)',
                  border: `1.5px solid ${slot === s ? doctor.color : 'var(--gray-200)'}`,
                  background: slot === s ? doctor.color : '#fff',
                  color: slot === s ? '#fff' : 'var(--gray-700)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .15s',
                }}>{s}</button>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 8 }}>
                Message to Doctor (optional)
              </label>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="Briefly describe your condition..."
                rows={3} style={{
                  width: '100%', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)',
                  padding: '12px 14px', fontSize: 14, fontFamily: 'inherit',
                  resize: 'none', outline: 'none', color: 'var(--gray-800)',
                }} />
            </div>

            <Button fullWidth size="lg" disabled={!slot} onClick={handleBook}
              style={{ background: slot ? doctor.color : 'var(--gray-200)', border: 'none', boxShadow: slot ? `0 4px 16px ${doctor.color}44` : 'none' }}>
              📅 Book Session {slot ? `— ${slot}` : ''}
            </Button>
          </Card>
        ) : (
          <Card style={{ padding: '32px', textAlign: 'center', marginBottom: 16 }}>
            <HiCheckCircle size={52} color="#10b981" style={{ marginBottom: 12 }} />
            <h3 style={{ fontWeight: 800, fontSize: 18, color: 'var(--gray-900)', marginBottom: 8 }}>Booking Confirmed!</h3>
            <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>
              Your session with {doctor.name} is booked at {slot}.<br />Redirecting to your home…
            </p>
          </Card>
        )}
        <Button fullWidth variant="secondary" size="lg" style={{ borderColor: doctor.color, color: doctor.color, marginBottom: 16 }} onClick={() => navigate('/patient/tracker')}>Go to exercises </Button>


        {/* Message button */}
        <Button fullWidth variant="secondary" size="lg" icon={<FiMessageSquare />}
          style={{ borderColor: doctor.color, color: doctor.color }}
          onClick={() => navigate('/patient/messages')}>
          Send Message
        </Button>
      </div>
    </div>
  );
}
