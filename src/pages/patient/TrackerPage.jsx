// ── Tracker page — wraps the existing tracker logic ──────────
// Imports all hooks and components from the previous v5 build
// and renders them inside a full-screen layout with a back button.

import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { EXERCISES_BY_INJURY } from '../../data/mockData';
import { AuthContext } from '../../context/AuthContext';

// ── Shared tracker components (inline, self-contained) ────────

// MediaPipe landmark indices
const LM = {
  left_shoulder:11, right_shoulder:12, left_elbow:13, right_elbow:14,
  left_wrist:15, right_wrist:16, left_hip:23, right_hip:24,
  left_knee:25, right_knee:26, left_ankle:27, right_ankle:28,
  nose:0, left_ear:7, right_ear:8,
};
const CONNECTIONS = [
  ['left_shoulder','right_shoulder'],['left_shoulder','left_elbow'],['left_elbow','left_wrist'],
  ['right_shoulder','right_elbow'],['right_elbow','right_wrist'],['left_shoulder','left_hip'],
  ['right_shoulder','right_hip'],['left_hip','right_hip'],
];

function vecAngle(a,b,c){
  const ab={x:a.x-b.x,y:a.y-b.y},cb={x:c.x-b.x,y:c.y-b.y};
  const dot=ab.x*cb.x+ab.y*cb.y, mag=Math.sqrt(ab.x**2+ab.y**2)*Math.sqrt(cb.x**2+cb.y**2);
  if(!mag) return 0;
  return Math.round(Math.acos(Math.min(1,Math.max(-1,dot/mag)))*(180/Math.PI));
}

function computeAngle(lm, type, side){
  const s=side;
  if(type==='shoulder'){
    const h=lm[LM[`${s}_hip`]],sh=lm[LM[`${s}_shoulder`]],el=lm[LM[`${s}_elbow`]];
    if(!h||!sh||!el||(sh.visibility??1)<.4) return 0;
    return vecAngle(h,sh,el);
  }
  if(type==='knee'){
    const h=lm[LM[`${s}_hip`]],k=lm[LM[`${s}_knee`]],a=lm[LM[`${s}_ankle`]];
    if(!h||!k||!a||(k.visibility??1)<.4) return 0;
    return vecAngle(h,k,a);
  }
  return 0;
}

function drawScene(ctx,lm,W,H,ex,side,angle){
  const reached=angle>=ex.target*.9, col=reached?'#10b981':ex.color;
  const active=[`${side}_hip`,`${side}_shoulder`,`${side}_elbow`,`${side}_wrist`];
  CONNECTIONS.forEach(([a,b])=>{
    const pa=lm[LM[a]],pb=lm[LM[b]];
    if(!pa||!pb||(pa.visibility??1)<.25) return;
    const isA=active.includes(a)&&active.includes(b);
    ctx.beginPath(); ctx.moveTo(pa.x*W,pa.y*H); ctx.lineTo(pb.x*W,pb.y*H);
    ctx.strokeStyle=isA?col:'rgba(148,163,184,.4)'; ctx.lineWidth=isA?5:2; ctx.stroke();
  });
  Object.entries(LM).forEach(([name,idx])=>{
    const pt=lm[idx]; if(!pt||(pt.visibility??1)<.25) return;
    const isA=active.includes(name);
    ctx.beginPath(); ctx.arc(pt.x*W,pt.y*H,isA?9:4,0,Math.PI*2);
    ctx.fillStyle=isA?col:'rgba(148,163,184,.5)'; ctx.fill();
    if(isA){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();}
  });
  const sh=lm[LM[`${side}_shoulder`]];
  if(sh){
    const cx=sh.x*W,cy=sh.y*H,r=44,pct=Math.min(1,angle/ex.target);
    ctx.beginPath(); ctx.arc(cx,cy,r,-Math.PI/2,Math.PI*3/2); ctx.strokeStyle='rgba(255,255,255,.15)'; ctx.lineWidth=7; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+pct*Math.PI*2); ctx.strokeStyle=col; ctx.lineWidth=7; ctx.lineCap='round'; ctx.stroke();
    ctx.fillStyle=col; ctx.font="bold 16px 'Plus Jakarta Sans',sans-serif"; ctx.textAlign='center';
    ctx.fillText(`${angle}°`,cx,cy-r-10); ctx.textAlign='left';
  }
}

function useTimer(running){
  const [t,setT]=useState(0); const ref=useRef(null),start=useRef(null);
  useEffect(()=>{
    if(running){start.current=Date.now()-t*1000; ref.current=setInterval(()=>setT(Math.floor((Date.now()-start.current)/1000)),1000);}
    else clearInterval(ref.current);
    return()=>clearInterval(ref.current);
  },[running]);
  const reset=()=>setT(0);
  return{display:`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`,reset};
}

// ── Main TrackerPage ──────────────────────────────────────────
export default function TrackerPage(){
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const videoRef = useRef(null), canvasRef = useRef(null);

  const [injury]   = useState('shoulder');
  const exercises  = EXERCISES_BY_INJURY[injury] || [];
  const [exIdx, setExIdx]       = useState(0);
  const ex = exercises[exIdx] || exercises[0];

  const [side, setSide]         = useState('left');
  const [targetReps, setTargetReps] = useState(10);
  const [tracking, setTracking] = useState(false);
  const [running, setRunning]   = useState(false);
  const [angle, setAngle]       = useState(null);
  const [reps, setReps]         = useState(0);
  const [log, setLog]           = useState([]);
  const [celebrating, setCelebrating] = useState(false);

  const runRef=useRef(false), sideRef=useRef('left'), exRef=useRef(ex), tRepsRef=useRef(10);
  const repsRef=useRef(0), isUpRef=useRef(false), peakRef=useRef(0);
  const poseRef=useRef(null), camRef=useRef(null);

  useEffect(()=>{runRef.current=running;},[running]);
  useEffect(()=>{sideRef.current=side;},[side]);
  useEffect(()=>{exRef.current=ex;},[ex]);
  useEffect(()=>{tRepsRef.current=targetReps;},[targetReps]);

  const {display:timer, reset:resetTimer} = useTimer(running);

  const onFrame=useCallback(a=>{
    if(!runRef.current||a===null){setAngle(null);return;}
    setAngle(a);
    const ex=exRef.current;
    if(a>peakRef.current)peakRef.current=a;
    if(!isUpRef.current&&a>=ex.upThresh){isUpRef.current=true;peakRef.current=a;}
    if(isUpRef.current&&a<=ex.downThresh){
      isUpRef.current=false;
      const peak=peakRef.current; peakRef.current=0;
      repsRef.current++;
      setReps(repsRef.current);
      const time=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
      setLog(p=>[...p,{repNum:repsRef.current,ex:exRef.current,side:sideRef.current,peakAngle:peak,time}]);
      if(repsRef.current>=tRepsRef.current){
        setCelebrating(true);
        saveSession();
        setTimeout(()=>{setCelebrating(false);runRef.current=false;setRunning(false);},3000);
      }
    }
  },[]);

  async function saveSession() {
    if (repsRef.current === 0) return;
    try {
      await fetch('/api/patient/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          exerciseName: exRef.current.nameEn,
          durationMinutes: 5, // mock duration for now
          repsCompleted: repsRef.current,
          maxAngle: peakRef.current || 0,
        })
      });
    } catch (err) {
      console.error('Failed to log session', err);
    }
  }

  async function startCam(){
    if(!window.Pose||!window.Camera)return false;
    const pose=new window.Pose({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}`});
    pose.setOptions({modelComplexity:1,smoothLandmarks:true,enableSegmentation:false,minDetectionConfidence:.5,minTrackingConfidence:.5});
    pose.onResults(results=>{
      const v=videoRef.current,c=canvasRef.current;
      if(!c||!v)return;
      c.width=v.videoWidth||640; c.height=v.videoHeight||480;
      const ctx=c.getContext('2d');
      ctx.clearRect(0,0,c.width,c.height);
      if(!results.poseLandmarks){onFrame(null);return;}
      const a=computeAngle(results.poseLandmarks,exRef.current.angle_type,sideRef.current);
      drawScene(ctx,results.poseLandmarks,c.width,c.height,exRef.current,sideRef.current,a);
      onFrame(a);
    });
    poseRef.current=pose;
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{width:1280,height:720}});
      videoRef.current.srcObject=stream; await videoRef.current.play();
      const cam=new window.Camera(videoRef.current,{onFrame:async()=>{if(poseRef.current)await poseRef.current.send({image:videoRef.current});},width:1280,height:720});
      cam.start(); camRef.current=cam; return true;
    }catch(e){console.error(e);return false;}
  }

  async function handleStart(){
    const ok=await startCam();
    if(!ok)return alert('Allow camera access and try again');
    setTracking(true);setRunning(true);runRef.current=true;resetTimer();
  }
  function handleToggle(){if(!tracking){handleStart();return;}const n=!running;setRunning(n);runRef.current=n;}
  function handleReset(){repsRef.current=0;isUpRef.current=false;peakRef.current=0;setReps(0);setAngle(null);setLog([]);}
  function handleStop(){
    if (repsRef.current > 0) saveSession();
    camRef.current?.stop?.();if(videoRef.current?.srcObject)videoRef.current.srcObject.getTracks().forEach(t=>t.stop());setTracking(false);setRunning(false);runRef.current=false;handleReset();resetTimer();
  }

  if(!ex) return null;

  const reached=angle!==null&&angle>=ex.target*.9;
  const angleColor=reached?'#10b981':angle>ex.target*.55?ex.color:'#d1d5db';

  return(
    <div style={{width:'100vw',height:'100vh',display:'grid',gridTemplateColumns:'1fr 360px',gridTemplateRows:'56px 1fr',background:'#fff',overflow:'hidden'}}>
      {/* Header */}
      <div style={{gridColumn:'1/-1',background:'#fff',borderBottom:'1px solid var(--gray-100)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px',boxShadow:'var(--shadow-sm)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <button onClick={()=>{handleStop();navigate('/patient/home');}} style={{display:'flex',alignItems:'center',gap:6,border:'none',background:'none',cursor:'pointer',color:'var(--gray-600)',fontSize:14,fontWeight:600}}>
            <HiArrowLeft/> Back
          </button>
          <span style={{fontWeight:700,fontSize:15}}>Exercise Tracker</span>
        </div>
        <div style={{display:'flex',gap:20,fontSize:13,color:'var(--gray-500)'}}>
          <span>⏱ {timer}</span>
          <span style={{fontWeight:700,color:ex.color}}>🔥 {reps} reps</span>
          <span style={{background:ex.color+'15',color:ex.color,borderRadius:'var(--radius-full)',padding:'3px 12px',fontSize:12,fontWeight:700}}>
            {side==='left'?'◀ Left':'Right ▶'}
          </span>
        </div>
      </div>

      {/* Camera */}
      <div style={{position:'relative',background:'#0f172a',overflow:'hidden'}}>
        {!tracking&&(
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:20,background:'var(--gray-50)'}}>
            <div style={{fontSize:64,opacity:.12}}>📷</div>
            <p style={{fontSize:16,color:'var(--gray-400)'}}>Press Start to enable camera</p>
            <button onClick={handleStart} style={{background:ex.color,color:'#fff',border:'none',borderRadius:'var(--radius-lg)',padding:'13px 36px',fontSize:16,fontWeight:700,cursor:'pointer'}}>
              Start Tracking
            </button>
          </div>
        )}
        <video ref={videoRef} playsInline autoPlay muted style={{width:'100%',height:'100%',objectFit:'cover',transform:'scaleX(-1)',display:tracking?'block':'none'}}/>
        <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',transform:'scaleX(-1)',display:tracking?'block':'none'}}/>
        {tracking&&(
          <>
            <div style={{position:'absolute',top:14,left:'50%',transform:'translateX(-50%)',background:'rgba(255,255,255,.92)',backdropFilter:'blur(12px)',borderRadius:'var(--radius-full)',padding:'7px 20px',display:'flex',alignItems:'center',gap:10,fontSize:13,boxShadow:'var(--shadow-md)'}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:running?'#10b981':'#f59e0b'}}/>
              {ex.nameEn} · {side==='left'?'Left':'Right'} · Target {ex.target}°
            </div>
            <div style={{position:'absolute',bottom:28,left:'50%',transform:'translateX(-50%)',textAlign:'center',pointerEvents:'none'}}>
              <div style={{fontSize:96,fontWeight:900,lineHeight:1,color:reached?'#4ade80':angle>ex.target*.55?'#fde68a':'#fff',textShadow:'0 2px 16px rgba(0,0,0,.6)',transition:'color .3s'}}>
                {angle??'--'}<span style={{fontSize:44}}>°</span>
              </div>
              <div style={{fontSize:13,color:'rgba(255,255,255,.6)'}}>Shoulder Angle</div>
              {reached&&<div style={{marginTop:8,background:'#10b981',color:'#fff',borderRadius:'var(--radius-full)',padding:'6px 22px',fontSize:14,fontWeight:700}}>✅ Target Reached!</div>}
            </div>
            {celebrating&&(
              <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.55)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{fontSize:40,fontWeight:900,color:'#fff',textShadow:'0 0 40px #10b981'}}>🎯 Session Complete!</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right panel */}
      <div style={{background:'var(--gray-50)',borderLeft:'1px solid var(--gray-100)',padding:16,overflowY:'auto',display:'flex',flexDirection:'column',gap:14}}>

        {/* Exercise tabs */}
        <div>
          <div style={{fontSize:10,fontWeight:700,color:'var(--gray-400)',letterSpacing:1.5,textTransform:'uppercase',marginBottom:8}}>Exercise</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {exercises.map((e,i)=>(
              <button key={e.key} onClick={()=>{setExIdx(i);exRef.current=e;handleReset();}} style={{flex:'1 1 28%',padding:'10px 6px',background:exIdx===i?e.color:'#fff',color:exIdx===i?'#fff':'var(--gray-500)',border:`1.5px solid ${exIdx===i?e.color:'var(--gray-200)'}`,borderRadius:'var(--radius-md)',fontSize:11,fontWeight:700,cursor:'pointer',textAlign:'center',transition:'all .2s'}}>
                <div style={{fontSize:16,marginBottom:3}}>{e.icon}</div>
                <div>{e.nameEn}</div>
                <div style={{fontSize:10,opacity:.75,marginTop:1}}>{e.target}°</div>
              </button>
            ))}
          </div>
        </div>

        {/* Side */}
        <div>
          <div style={{fontSize:10,fontWeight:700,color:'var(--gray-400)',letterSpacing:1.5,textTransform:'uppercase',marginBottom:8}}>Side</div>
          <div style={{display:'flex',gap:6}}>
            {[['left','◀ Left'],['right','Right ▶']].map(([s,lbl])=>(
              <button key={s} onClick={()=>{setSide(s);sideRef.current=s;handleReset();}} style={{flex:1,padding:'9px',border:`1.5px solid ${side===s?'var(--gray-900)':'var(--gray-200)'}`,borderRadius:'var(--radius-md)',background:side===s?'var(--gray-900)':'#fff',color:side===s?'#fff':'var(--gray-600)',fontSize:13,fontWeight:700,cursor:'pointer'}}>{lbl}</button>
            ))}
          </div>
        </div>

        {/* Angle meter */}
        <div style={{background:'#fff',border:`2px solid ${reached?'#10b981':'var(--gray-100)'}`,borderRadius:'var(--radius-lg)',padding:'18px 20px',textAlign:'center',transition:'border-color .3s'}}>
          <div style={{fontSize:10,color:'var(--gray-400)',fontWeight:700,letterSpacing:2,marginBottom:8}}>SHOULDER ANGLE</div>
          <div style={{fontFamily:'monospace',fontSize:72,fontWeight:900,lineHeight:1,color:angleColor,transition:'color .3s'}}>{angle??'--'}<span style={{fontSize:28,fontWeight:400}}>°</span></div>
          <div style={{height:6,background:'var(--gray-100)',borderRadius:3,overflow:'hidden',margin:'12px 0 6px'}}>
            <div style={{height:'100%',width:`${Math.min(100,((angle??0)/ex.target)*100)}%`,background:reached?'#10b981':ex.color,borderRadius:3,transition:'width .3s'}}/>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--gray-400)'}}>
            <span>0°</span><span style={{color:angleColor,fontWeight:700}}>{Math.min(100,Math.round(((angle??0)/ex.target)*100))}%</span><span>{ex.target}°</span>
          </div>
          {reached&&<div style={{marginTop:10,background:'#dcfce7',color:'#16a34a',borderRadius:'var(--radius-md)',padding:'6px 12px',fontSize:13,fontWeight:700}}>✅ Target reached!</div>}
        </div>

        {/* Reps */}
        <div style={{background:'#fff',border:'1px solid var(--gray-100)',borderRadius:'var(--radius-lg)',padding:'16px 18px'}}>
          <div style={{fontSize:10,color:'var(--gray-400)',fontWeight:700,letterSpacing:2,marginBottom:10}}>REPETITIONS</div>
          <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:10}}>
            <span style={{fontFamily:'monospace',fontSize:52,fontWeight:900,color:ex.color,lineHeight:1}}>{reps}</span>
            <span style={{fontSize:24,color:'var(--gray-300)'}}>/&nbsp;{targetReps}</span>
          </div>
          <div style={{height:4,background:'var(--gray-100)',borderRadius:2,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${Math.min(100,(reps/targetReps)*100)}%`,background:ex.color,borderRadius:2,transition:'width .4s'}}/>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:10}}>
            <span style={{fontSize:11,color:'var(--gray-400)'}}>Target</span>
            <input type="range" min="5" max="30" step="5" value={targetReps} onChange={e=>{setTargetReps(Number(e.target.value));tRepsRef.current=Number(e.target.value);}} style={{flex:1,accentColor:ex.color}}/>
            <span style={{fontSize:13,fontWeight:700,color:ex.color,minWidth:24}}>{targetReps}</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <button onClick={handleToggle} style={{gridColumn:'1/-1',background:ex.color,color:'#fff',border:'none',borderRadius:'var(--radius-md)',padding:'13px',fontSize:15,fontWeight:700,cursor:'pointer',boxShadow:`0 4px 16px ${ex.color}44`}}>
            {!tracking?'▶ Start Session':running?'⏸ Pause':'▶ Resume'}
          </button>
          <button onClick={handleReset} style={{background:'var(--gray-50)',color:'var(--gray-600)',border:'1px solid var(--gray-200)',borderRadius:'var(--radius-md)',padding:11,fontSize:13,fontWeight:600,cursor:'pointer'}}>🔄 Reset</button>
          <button onClick={handleStop}  style={{background:'#fff5f5',color:'var(--danger)',border:'1px solid #fecaca',borderRadius:'var(--radius-md)',padding:11,fontSize:13,fontWeight:600,cursor:'pointer'}}>⏹ Stop</button>
        </div>

        {/* Log */}
        <div style={{background:'#fff',border:'1px solid var(--gray-100)',borderRadius:'var(--radius-lg)',overflow:'hidden',flex:1,minHeight:0}}>
          <div style={{padding:'10px 14px',borderBottom:'1px solid var(--gray-100)',fontSize:10,color:'var(--gray-400)',fontWeight:700,letterSpacing:2}}>MOVEMENT LOG</div>
          <div style={{overflowY:'auto',maxHeight:200,padding:'6px 0'}}>
            {log.length===0
              ? <div style={{padding:'20px 14px',textAlign:'center',color:'var(--gray-300)',fontSize:13}}>Start exercising to log movements</div>
              : log.map((e,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 14px',borderBottom:i<log.length-1?'1px solid var(--gray-50)':'none'}}>
                  <div style={{width:26,height:26,borderRadius:'50%',background:e.ex.color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:e.ex.color}}>{e.repNum}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600}}>{e.ex.nameEn}</div>
                    <div style={{fontSize:11,color:'var(--gray-400)'}}>{e.time}</div>
                  </div>
                  <div style={{background:e.ex.color+'15',color:e.ex.color,borderRadius:'var(--radius-sm)',padding:'2px 8px',fontSize:12,fontWeight:700}}>↑ {e.peakAngle}°</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* MediaPipe */}
      <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"/>
      <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"/>
    </div>
  );
}
