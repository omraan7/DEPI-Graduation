import { useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiStar } from 'react-icons/hi';
import { FiClock, FiShield, FiAward } from 'react-icons/fi';
import { MdOutlineSupportAgent, MdOutlineHealthAndSafety } from 'react-icons/md';
import { BsCalendarCheck, BsHouseDoor } from 'react-icons/bs';
import { RiMentalHealthLine } from 'react-icons/ri';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import p from '../assets/p1.png';
import p2 from '../assets/p2.png';

// ── Hero ──────
function Hero() {
  const navigate = useNavigate();
  return (
    <section style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #fff 60%)', padding: '80px 0 60px' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div style={{ animation: 'fadeUp .6s ease' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--primary-light)', color: 'var(--primary)',
            borderRadius: 'var(--radius-full)', padding: '5px 14px', fontSize: 13, fontWeight: 600,
            marginBottom: 24,
          }}>
            <HiCheckCircle size={15} /> Licensed & Vetted Therapists
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.12, color: 'var(--gray-900)', marginBottom: 20 }}>
            Professional<br/>Physical Therapy<br/>
            <span style={{ color: 'var(--primary)' }}>at Home</span>
          </h1>

          <p style={{ fontSize: 17, color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 36, maxWidth: 460 }}>
            Recover faster with personalized care from certified experts in the comfort of your own home. Skip the waiting room and start healing today.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 36 }}>
            <Button size="lg" onClick={() => navigate('/auth?role=patient')} style={{ boxShadow: '0 4px 20px rgba(26,86,219,.35)' }}>
              Request a Home Visit
            </Button>
            <Button size="lg" variant="ghost" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </Button>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex' }}>
              {['#1a56db','#db2777','#10b981','#f59e0b'].map((c, i) => (
                <div key={c} style={{ width:36, height:36, borderRadius:'50%', background:c, border:'2px solid #fff', marginRight:-10, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:700, zIndex:4-i }}>
                  {['AM','FH','MS','NK'][i]}
                </div>
              ))}
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                {[1,2,3,4,5].map(i => <HiStar key={i} size={15} color="#f59e0b"/>)}
                <span style={{ fontWeight:700, fontSize:14, marginLeft:4 }}>4.9/5 Rating</span>
              </div>
              <div style={{ fontSize:13, color:'var(--gray-500)' }}>from 2,000+ patients</div>
            </div>
          </div>
        </div>

        {/* Image placeholder */}
        <div style={{ position:'relative', animation:'fadeUp .7s .1s ease both' }}>
          {/* <div style={{
            borderRadius: 'var(--radius-xl)', overflow: 'hidden',
            background: 'linear-gradient(135deg, #e0eaff, #f0f7ff)',
            aspectRatio: '4/3', display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: 'var(--shadow-lg)',
          }}> */}
            {/* <div style={{ textAlign:'center', color:'var(--gray-400)' }}> */}
              {/* <MdOutlineHealthAndSafety size={64} />
              <p style={{ fontSize:14, marginTop:8 }}>Physical Therapy Session</p> */}
              <img src={p} alt="" style={{ borderRadius:'var(--radius-xl)', boxShadow:'var(--shadow-lg)' }} />
            {/* </div> */}
          {/* </div> */}
          {/* Floating badge */}
          <div style={{
            position:'absolute', bottom:24, right:24,
            background:'#fff', borderRadius:'var(--radius-md)',
            padding:'12px 16px', boxShadow:'var(--shadow-lg)',
            display:'flex', alignItems:'center', gap:10,
          }}>
            <HiCheckCircle size={20} color="var(--success)" />
            <div>
              <div style={{ fontSize:13, fontWeight:700 }}>Recovery on Track</div>
              <div style={{ fontSize:11, color:'var(--gray-500)' }}>Keep up the good work!</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── How it Works 
function HowItWorks() {
  const steps = [
    { num:'1', icon:<RiMentalHealthLine size={28}/>, title:'Smart Diagnosis', desc:'Complete a quick AI-assisted assessment to understand your pain points and specific needs.' },
    { num:'2', icon:<BsCalendarCheck size={28}/>,   title:'Book Visit',       desc:'Choose a certified therapist and a time that fits your schedule perfectly.' },
    { num:'3', icon:<BsHouseDoor size={28}/>,       title:'Recover at Home',  desc:'Receive professional care, massage, and exercises without ever leaving your house.' },
  ];
  return (
    <section id="how" style={{ background:'var(--gray-50)', padding:'96px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ color:'var(--primary)', fontWeight:700, fontSize:13, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Simple Process</div>
          <h2 style={{ fontSize:40, fontWeight:800, color:'var(--gray-900)', marginBottom:16 }}>How PhysioHome Works</h2>
          <p style={{ fontSize:17, color:'var(--gray-600)', maxWidth:520, margin:'0 auto', lineHeight:1.7 }}>
            Get back to moving freely in three simple steps. We've streamlined the process to focus on your recovery.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:28 }}>
          {steps.map(s => (
            <Card key={s.num} hover style={{ textAlign:'center', padding:'36px 28px' }}>
              <div style={{ width:56, height:56, borderRadius:'var(--radius-lg)', background:'var(--primary-light)', color:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize:18, fontWeight:700, marginBottom:10 }}>{s.num}. {s.title}</h3>
              <p style={{ color:'var(--gray-600)', fontSize:14, lineHeight:1.7 }}>{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Why Choose 
function WhyChoose() {
  const features = [
    { icon:<RiMentalHealthLine size={22}/>, title:'Intelligent Initial Pain Diagnosis', desc:'Our smart tools help pinpoint your pain points before the first visit, saving time and ensuring the right specialist is assigned.' },
    { icon:<FiShield size={22}/>,           title:'Certified Professionals',            desc:'Rest easy knowing that every therapist on our platform is fully licensed, background-checked, and highly experienced.' },
    { icon:<FiClock size={22}/>,            title:'Flexible Scheduling',                desc:"We work around your life. Early mornings, evenings, or weekends — book a session when it suits you best." },
  ];
  return (
    <section id="services" style={{ padding:'96px 0' }}>
      <div className="container" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
        {/* Image */}
        <div style={{ position:'relative' }}>
          {/* <div style={{ borderRadius:'var(--radius-xl)', background:'linear-gradient(135deg,#e0eaff,#f0f7ff)', aspectRatio:'4/3', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-lg)' }}>
            <MdOutlineSupportAgent size={80} color="var(--gray-300)" />
          </div>kkk */}
          <img src={p2} alt="" style={{ borderRadius:'var(--radius-xl)', boxShadow:'var(--shadow-lg)' }} />
          <div style={{ position:'absolute', bottom:24, left:24, background:'var(--primary)', color:'#fff', borderRadius:'var(--radius-md)', padding:'10px 16px' }}>
            <div style={{ fontWeight:700, fontSize:14 }}>100% Certified</div>
            <div style={{ fontSize:12, opacity:.8 }}>All therapists are vetted professionals.</div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize:38, fontWeight:800, color:'var(--gray-900)', marginBottom:16 }}>Why Choose PhysioHome?</h2>
          <p style={{ fontSize:16, color:'var(--gray-600)', marginBottom:36, lineHeight:1.7 }}>
            Experience the benefits of modern, accessible healthcare designed around your life.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
            {features.map(f => (
              <div key={f.title} style={{ display:'flex', gap:16 }}>
                <div style={{ width:44, height:44, borderRadius:'var(--radius-md)', background:'var(--primary-light)', color:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{f.icon}</div>
                <div>
                  <h4 style={{ fontWeight:700, fontSize:15, marginBottom:6 }}>{f.title}</h4>
                  <p style={{ color:'var(--gray-600)', fontSize:14, lineHeight:1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    { stars:5, text:'"The convenience of having a therapist come to my home was a game changer for my knee recovery. Highly recommended!"', name:'Sarah Jenkins', detail:'Recovered from Knee Surgery' },
    { stars:4, text:'"Professional, punctual, and very knowledgeable. The app made booking incredibly easy."', name:'Michael Torres', detail:'Back Pain Therapy' },
  ];
  return (
    <section style={{ background:'var(--gray-50)', padding:'96px 0' }}>
      <div className="container">
        <h2 style={{ textAlign:'center', fontSize:38, fontWeight:800, color:'var(--gray-900)', marginBottom:48 }}>Trusted by Patients</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:24, maxWidth:900, margin:'0 auto' }}>
          {reviews.map(r => (
            <Card key={r.name} style={{ padding:'32px' }}>
              <div style={{ display:'flex', gap:3, marginBottom:16 }}>
                {[...Array(r.stars)].map((_,i) => <HiStar key={i} size={18} color="#f59e0b"/>)}
              </div>
              <p style={{ color:'var(--gray-700)', fontSize:15, lineHeight:1.7, marginBottom:20 }}>{r.text}</p>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--primary-light)', color:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>
                  {r.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>{r.name}</div>
                  <div style={{ fontSize:12, color:'var(--gray-500)' }}>{r.detail}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner 
function CTABanner() {
  const navigate = useNavigate();
  return (
    <section style={{ padding:'96px 0' }}>
      <div className="container">
        <div style={{
          background:'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)',
          borderRadius:'var(--radius-xl)', padding:'64px 48px',
          textAlign:'center', color:'#fff', boxShadow:'0 20px 60px rgba(26,86,219,.35)',
        }}>
          <h2 style={{ fontSize:38, fontWeight:800, marginBottom:14 }}>Ready to start your recovery?</h2>
          <p style={{ fontSize:17, opacity:.85, marginBottom:32, maxWidth:500, margin:'0 auto 32px' }}>
            Join thousands of patients recovering comfortably at home. Sign up today and book your first session in minutes.
          </p>
          <Button size="xl" variant="white" onClick={() => navigate('/auth?role=patient')}
            style={{ boxShadow:'0 4px 20px rgba(0,0,0,.2)' }}>
            Get Started Now
          </Button>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────
export default function Landing() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <WhyChoose />
      <Testimonials />
      <CTABanner />
    </>
  );
}
