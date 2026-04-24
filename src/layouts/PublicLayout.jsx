import { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import Button from '../components/ui/Button';

// ── Top Navbar for public / landing pages ────────────────────
function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { label: 'Our Services', href: '#services' },
    { label: 'How it Works', href: '#how' },
    { label: 'For Therapists', href: '/auth?role=doctor' },
  ];

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--gray-100)',
      boxShadow: '0 1px 8px rgba(0,0,0,.06)',
    }}>
      <div className="container" style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 20, color: 'var(--primary)' }}>
          <HiOutlineLocationMarker size={22} />
          PhysioHome
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desktop-nav">
          {links.map(l => (
            <a key={l.label} href={l.href} style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-700)', transition: 'color .15s' }}
              onMouseEnter={e => e.target.style.color = 'var(--primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--gray-700)'}
            >{l.label}</a>
          ))}
        </nav>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>Login</Button>
          <Button size="sm" onClick={() => navigate('/auth')}>  Sign Up</Button>
          <button onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', padding: 4 }} className="burger">
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: '#fff', borderTop: '1px solid var(--gray-100)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {links.map(l => <a key={l.label} href={l.href} style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-700)' }} onClick={() => setOpen(false)}>{l.label}</a>)}
          <Button fullWidth onClick={() => { navigate('/auth'); setOpen(false); }}>Login / Sign Up</Button>
        </div>
      )}

      <style>{`
        @media (max-width:768px) { .desktop-nav{display:none!important} .burger{display:flex!important} }
      `}</style>
    </header>
  );
}

// ── Footer ────────────────────────────────────────────────────
function PublicFooter() {
  const cols = [
    { title: 'Company',  links: ['About Us','Careers','Contact','Blog'] },
    { title: 'Services', links: ['Physical Therapy','Post-Op Recovery','Sports Massage','Elderly Care'] },
    { title: 'Contact',  items: ['support@physiohome.com','+1 (555) 123-4567','New York, NY'] },
  ];
  return (
    <footer style={{ background: 'var(--gray-900)', color: '#fff', paddingTop: 64, paddingBottom: 32 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 14 }}>
              <HiOutlineLocationMarker size={20} /> PhysioHome
            </div>
            <p style={{ color: 'var(--gray-400)', fontSize: 14, lineHeight: 1.7 }}>
              Bringing professional physical therapy to your doorstep. Licensed, vetted, and ready to help you heal.
            </p>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(col.links || col.items || []).map(item => (
                  <li key={item} style={{ color: 'var(--gray-400)', fontSize: 14, cursor: col.links ? 'pointer' : 'default' }}
                    onMouseEnter={e => { if (col.links) e.target.style.color = '#fff'; }}
                    onMouseLeave={e => { if (col.links) e.target.style.color = 'var(--gray-400)'; }}
                  >{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--gray-800)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--gray-500)' }}>
          <span>© 2024 PhysioHome Inc. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }}>HIPAA Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Layout shell ──────────────────────────────────────────────
export default function PublicLayout() {
  return (
    <>
      <PublicNavbar />
      <main style={{ paddingTop: 68 }}>
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
}
