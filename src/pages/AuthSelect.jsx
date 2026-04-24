import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiUserGroup, HiUser } from 'react-icons/hi';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { MdLocalHospital } from 'react-icons/md';

export default function AuthSelect() {
  const navigate      = useNavigate();
  const [params]      = useSearchParams();
  const preselected   = params.get('role');

  const roles = [
    {
      id:    'patient',
      icon:  <HiUser size={36} />,
      title: 'I\'m a Patient',
      desc:  'Find certified therapists, book sessions, and track your recovery — all from home.',
      color: 'var(--primary)',
      bg:    'var(--primary-light)',
      path:  '/patient/chat',
      steps: ['AI Pain Assessment', 'Doctor Recommendation', 'Book & Track Progress'],
    },
    {
      id:    'doctor',
      icon:  <MdLocalHospital size={36} />,
      title: 'I\'m a Therapist',
      desc:  'Manage your patients, monitor their progress, and deliver care remotely.',
      color: '#10b981',
      bg:    '#ecfdf5',
      path:  '/doctor/dashboard',
      steps: ['Manage Patients', 'Assign Exercises', 'Track & Analyze'],
    },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #f0f7ff 0%, #fff 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 24,
    }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:8, fontWeight:800, fontSize:22, color:'var(--primary)', marginBottom:48 }}>
        <HiOutlineLocationMarker size={24} /> PhysioHome
      </div>

      <div style={{ maxWidth:780, width:'100%' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <h1 style={{ fontSize:34, fontWeight:800, color:'var(--gray-900)', marginBottom:10 }}>
            Welcome! Who are you?
          </h1>
          <p style={{ fontSize:16, color:'var(--gray-600)' }}>
            Choose your role to get started with the right experience.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          {roles.map(role => (
            <button key={role.id} onClick={() => navigate(role.path)} style={{
              background:'#fff', border:`2px solid ${preselected === role.id ? role.color : 'var(--gray-200)'}`,
              borderRadius:'var(--radius-xl)', padding:'36px 28px',
              cursor:'pointer', textAlign:'center',
              boxShadow: preselected === role.id ? `0 0 0 4px ${role.color}22` : 'var(--shadow-sm)',
              transition:'all .2s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = role.color;
                e.currentTarget.style.boxShadow  = `0 8px 32px ${role.color}22`;
                e.currentTarget.style.transform   = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = preselected === role.id ? role.color : 'var(--gray-200)';
                e.currentTarget.style.boxShadow   = preselected === role.id ? `0 0 0 4px ${role.color}22` : 'var(--shadow-sm)';
                e.currentTarget.style.transform   = 'none';
              }}
            >
              <div style={{ width:72, height:72, borderRadius:'var(--radius-lg)', background:role.bg, color:role.color, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                {role.icon}
              </div>
              <h2 style={{ fontSize:22, fontWeight:800, color:'var(--gray-900)', marginBottom:10 }}>{role.title}</h2>
              <p style={{ fontSize:14, color:'var(--gray-600)', lineHeight:1.6, marginBottom:24 }}>{role.desc}</p>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {role.steps.map((step, i) => (
                  <div key={step} style={{ display:'flex', alignItems:'center', gap:10, textAlign:'right' }}>
                    <div style={{ width:22, height:22, borderRadius:'50%', background:role.bg, color:role.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>{i+1}</div>
                    <span style={{ fontSize:13, color:'var(--gray-700)', fontWeight:500 }}>{step}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        <p style={{ textAlign:'center', fontSize:13, color:'var(--gray-400)', marginTop:28 }}>
          Already have an account? <span style={{ color:'var(--primary)', cursor:'pointer', fontWeight:600 }}>Sign in</span>
        </p>
      </div>
    </div>
  );
}
