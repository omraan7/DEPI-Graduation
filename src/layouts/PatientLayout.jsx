import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HiHome, HiUser, HiChatAlt2, HiBell } from 'react-icons/hi';
import { HiOutlineLocationMarker } from 'react-icons/hi';

const NAV_ITEMS = [
  { path: '/patient/home',     icon: HiHome,     label: 'Home'     },
  { path: '/patient/profile',  icon: HiUser,     label: 'Profile'  },
  { path: '/patient/messages', icon: HiChatAlt2, label: 'Messages' },
  { path: '/patient/alerts',   icon: HiBell,     label: 'Alerts'   },
];

export default function PatientLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const isTracker = location.pathname.includes('/tracker');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar (hidden on tracker) */}
      {!isTracker && (
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: '#fff', borderBottom: '1px solid var(--gray-100)',
          height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, fontWeight:800, fontSize:18, color:'var(--primary)' }}>
            <HiOutlineLocationMarker size={20} /> PhysioHome
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button style={{ background:'none', border:'none', position:'relative', cursor:'pointer' }}>
              <HiBell size={22} color="var(--gray-500)" />
              <span style={{ position:'absolute', top:-2, right:-2, width:8, height:8, background:'var(--danger)', borderRadius:'50%' }}/>
            </button>
            <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--primary-light)', color:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13 }}>P</div>
          </div>
        </header>
      )}

      {/* Page content */}
      <div style={{ flex: 1, paddingBottom: isTracker ? 0 : 72 }}>
        <Outlet />
      </div>

      {/* Bottom navigation (hidden on tracker) */}
      {!isTracker && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: '#fff', borderTop: '1px solid var(--gray-100)',
          display: 'flex', height: 66,
          boxShadow: '0 -4px 20px rgba(0,0,0,.06)',
        }}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            const Icon   = item.icon;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 4, border: 'none', background: 'none',
                color: active ? 'var(--primary)' : 'var(--gray-400)',
                borderTop: `2px solid ${active ? 'var(--primary)' : 'transparent'}`,
                transition: 'all .15s',
              }}>
                <Icon size={22} />
                <span style={{ fontSize: 11, fontWeight: active ? 700 : 400 }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
