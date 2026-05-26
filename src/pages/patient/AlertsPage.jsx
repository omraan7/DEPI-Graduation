import { useState, useEffect, useContext } from 'react';
import { HiCheckCircle, HiClock, HiCalendar, HiBell } from 'react-icons/hi';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/ui/Card';

export default function AlertsPage() {
  const { token } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch('/api/patient/alerts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Transform backend Notification model to UI model
          const transformed = data.map(n => ({
            id: n._id,
            type: n.type,
            icon: <HiBell size={18}/>, // You can make this dynamic based on n.type
            color: 'var(--primary)',
            title: n.title,
            body: n.message,
            time: new Date(n.createdAt).toLocaleDateString(),
            read: n.isRead
          }));
          setAlerts(transformed);
        }
      } catch (err) {
        console.error('Failed to fetch alerts:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, [token]);

  function markRead(id) {
    setAlerts(prev => prev.map(a => a.id===id ? {...a, read:true} : a));
  }
  function markAllRead() {
    setAlerts(prev => prev.map(a => ({ ...a, read:true })));
  }

  const unread = alerts.filter(a => !a.read).length;

  return (
    <div style={{ padding:20 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:800, color:'var(--gray-900)', margin:0 }}>Notifications</h2>
          {unread > 0 && <p style={{ fontSize:13, color:'var(--gray-500)', marginTop:2 }}>{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} style={{ border:'none', background:'none', color:'var(--primary)', fontSize:13, fontWeight:600, cursor:'pointer' }}>
            Mark all read
          </button>
        )}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--gray-500)' }}>Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--gray-500)' }}>No notifications found.</div>
        ) : (
          alerts.map(a => (
            <Card key={a.id} onClick={() => markRead(a.id)} style={{
              padding:'14px 16px',
              borderLeft:`3px solid ${a.read ? 'var(--gray-100)' : a.color}`,
              opacity: a.read ? .7 : 1,
              cursor:'pointer',
            }}>
              <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:36, height:36, borderRadius:'var(--radius-md)', background:a.color+'18', color:a.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                  {a.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                    <span style={{ fontWeight:700, fontSize:14, color:'var(--gray-900)' }}>{a.title}</span>
                    <span style={{ fontSize:11, color:'var(--gray-400)', flexShrink:0, marginLeft:8 }}>{a.time}</span>
                  </div>
                  <p style={{ fontSize:13, color:'var(--gray-600)', margin:0, lineHeight:1.5 }}>{a.body}</p>
                </div>
                {!a.read && (
                  <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--primary)', flexShrink:0, marginTop:6 }}/>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
