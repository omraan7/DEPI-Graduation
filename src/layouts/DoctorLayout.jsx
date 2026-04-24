import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HiViewGrid, HiUsers, HiChartBar, HiChatAlt2, HiCog, HiLogout } from 'react-icons/hi';
import { HiOutlineLocationMarker } from 'react-icons/hi';

const SIDEBAR_ITEMS = [
  { path: '/doctor/dashboard', icon: HiViewGrid,  label: 'Dashboard' },
  { path: '/doctor/patients',  icon: HiUsers,     label: 'Patients'  },
  { path: '/doctor/analytics', icon: HiChartBar,  label: 'Analytics' },
  { path: '/doctor/messages',  icon: HiChatAlt2,  label: 'Messages'  },
  { path: '/doctor/settings',  icon: HiCog,       label: 'Settings'  },
];

export default function DoctorLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--gray-50)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: 'var(--gray-900)', display: 'flex',
        flexDirection: 'column', flexShrink: 0, overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, fontWeight:800, fontSize:18, color:'#fff' }}>
            <HiOutlineLocationMarker size={20} /> PhysioHome
          </div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', marginTop:4 }}>Doctor Portal</div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:4 }}>
          {SIDEBAR_ITEMS.map(item => {
            const active = location.pathname.startsWith(item.path);
            const Icon   = item.icon;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} style={{
                display:'flex', alignItems:'center', gap:12,
                padding:'11px 14px', borderRadius:'var(--radius-md)',
                border:'none', background: active ? 'rgba(255,255,255,.1)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,.5)',
                fontSize:14, fontWeight: active ? 600 : 400,
                cursor:'pointer', textAlign:'right',
                borderRight: `3px solid ${active ? 'var(--primary)' : 'transparent'}`,
                transition:'all .15s',
              }}>
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Doctor info + logout */}
        <div style={{ padding:'16px 12px', borderTop:'1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13 }}>SA</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>Dr. Sarah Ahmed</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>Physiotherapist</div>
            </div>
          </div>
          <button onClick={() => navigate('/')} style={{
            display:'flex', alignItems:'center', gap:8, width:'100%',
            padding:'9px 14px', borderRadius:'var(--radius-md)',
            border:'none', background:'transparent',
            color:'rgba(255,255,255,.5)', fontSize:13, cursor:'pointer',
            transition:'all .15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <HiLogout size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column' }}>
        {/* Top bar */}
        <div style={{
          background:'#fff', borderBottom:'1px solid var(--gray-100)',
          padding:'0 28px', height:64,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          position:'sticky', top:0, zIndex:10,
        }}>
          <div style={{ fontSize:13, color:'var(--gray-500)' }}>
            {new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button style={{ background:'none', border:'none', cursor:'pointer', position:'relative' }}>
              <HiChatAlt2 size={20} color="var(--gray-500)" />
            </button>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13 }}>SA</div>
          </div>
        </div>

        <div style={{ padding:28, flex:1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
