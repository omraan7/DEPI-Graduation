import { useState } from 'react';
import { HiCheckCircle, HiClock, HiCalendar, HiBell } from 'react-icons/hi';
import Card from '../../components/ui/Card';

const ALERTS = [
  { id:1, type:'session',  icon:<HiCalendar size={18}/>, color:'var(--primary)',  title:'Session Reminder',           body:'Your session with Dr. Sarah is tomorrow at 10:00 AM.', time:'2h ago',  read:false },
  { id:2, type:'progress', icon:<HiCheckCircle size={18}/>,color:'#10b981',       title:'Great Progress!',            body:'You\'ve completed 8 sessions. Keep it up!',             time:'1d ago',  read:false },
  { id:3, type:'exercise', icon:<HiBell size={18}/>,     color:'#f59e0b',          title:'New Exercise Assigned',      body:'Dr. Sarah added "Full Overhead" to your plan.',         time:'2d ago',  read:true },
  { id:4, type:'session',  icon:<HiClock size={18}/>,    color:'var(--primary)',   title:'Session Complete',           body:'You completed your shoulder session. 87° max angle.',   time:'3d ago',  read:true },
  { id:5, type:'progress', icon:<HiCheckCircle size={18}/>,color:'#10b981',       title:'Pain Level Improved',        body:'Your pain level dropped from 7 to 5. Excellent!',       time:'5d ago',  read:true },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(ALERTS);

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
        {alerts.map(a => (
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
        ))}
      </div>
    </div>
  );
}
