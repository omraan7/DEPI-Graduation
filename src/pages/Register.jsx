import { useState, useContext } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { HiOutlineLocationMarker } from 'react-icons/hi';

export default function Register() {
  const [params] = useSearchParams();
  const role = params.get('role') || 'patient';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await register(name, email, password, role);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

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

      <div style={{ maxWidth: 400, width: '100%', background: '#fff', borderRadius: 'var(--radius-xl)', padding: 32, boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 8, textAlign: 'center' }}>
          Create an account
        </h2>
        <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 24, textAlign: 'center' }}>
          Sign up as a {role === 'doctor' ? 'Therapist' : 'Patient'}
        </p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6 }}>Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--gray-200)', fontSize: 15,
                outline: 'none', transition: 'border-color .2s'
              }}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6 }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--gray-200)', fontSize: 15,
                outline: 'none', transition: 'border-color .2s'
              }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6 }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--gray-200)', fontSize: 15,
                outline: 'none', transition: 'border-color .2s'
              }}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%', padding: 14, background: 'var(--primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-md)', fontSize: 16, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8,
              opacity: loading ? 0.7 : 1, transition: 'background .2s'
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--gray-500)', marginTop: 24 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
