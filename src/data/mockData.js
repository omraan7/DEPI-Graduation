export const DOCTORS = [
  { id:'d1', name:'Dr. Sarah Ahmed',    specialty:'Shoulder & Spine Rehabilitation', injuries:['shoulder','back','neck'],       rating:4.9, reviews:128, experience:12, price:300, location:'Cairo — Nasr City',  avatar:'SA', color:'#db2777', bio:'Specialist in shoulder and spine rehabilitation with 12 years in sports PT.', available:true,  nextSlot:'Tomorrow 10AM', sessions:340 },
  { id:'d2', name:'Dr. Mohamed Hassan', specialty:'Knee & Joint Rehabilitation',      injuries:['knee','back'],                  rating:4.8, reviews:95,  experience:8,  price:250, location:'Cairo — Maadi',      avatar:'MH', color:'#1a56db', bio:'Expert in knee and joint rehabilitation for athletes and post-surgical recovery.',  available:true,  nextSlot:'Today 5PM',     sessions:210 },
  { id:'d3', name:'Dr. Noura Ibrahim',  specialty:'Neck & Headache Therapy',          injuries:['neck','back','shoulder'],       rating:4.7, reviews:74,  experience:6,  price:200, location:'Cairo — Zamalek',    avatar:'NI', color:'#7c3aed', bio:'Specialized in cervical pain and stress-related tension from prolonged desk work.', available:false, nextSlot:'Day after tomorrow 11AM', sessions:180 },
  { id:'d4', name:'Dr. Khaled Omar',    specialty:'General Physical Therapy',          injuries:['shoulder','knee','back','neck'], rating:4.6, reviews:56,  experience:5,  price:180, location:'Giza — Dokki',       avatar:'KO', color:'#10b981', bio:'General PT for all injuries, focusing on home exercises and patient empowerment.',  available:true,  nextSlot:'Today 7PM',     sessions:120 },
];

export const EXERCISES_BY_INJURY = {
  shoulder: [
    { key:'sh1', nameEn:'Shoulder Abduction', nameAr:'رفع جانبي',  icon:'↔', color:'#1a56db', target:90,  upThresh:65,  downThresh:20, angle_type:'shoulder', descEn:'Raise arm sideways to shoulder level' },
    { key:'sh2', nameEn:'Shoulder Flexion',   nameAr:'رفع للأمام', icon:'↑', color:'#d97706', target:120, upThresh:90,  downThresh:30, angle_type:'shoulder', descEn:'Raise arm forward slowly above shoulder' },
    { key:'sh3', nameEn:'Full Overhead',      nameAr:'رفع كامل',   icon:'🙌',color:'#7c3aed', target:180, upThresh:140, downThresh:50, angle_type:'shoulder', descEn:'Raise arm fully overhead' },
  ],
  knee: [
    { key:'kn1', nameEn:'Knee Flexion',       nameAr:'ثني الركبة', icon:'🦵',color:'#10b981', target:90,  upThresh:65,  downThresh:20, angle_type:'knee', descEn:'Bend knee slowly while standing' },
    { key:'kn2', nameEn:'Knee Extension',     nameAr:'مد الركبة',  icon:'📏',color:'#0891b2', target:170, upThresh:140, downThresh:60, angle_type:'knee', descEn:'Straighten knee from seated position' },
  ],
  neck: [
    { key:'nk1', nameEn:'Neck Lateral Tilt',  nameAr:'إمالة جانبية', icon:'↔', color:'#db2777', target:40, upThresh:28, downThresh:8, angle_type:'neck_lateral', descEn:'Tilt head slowly toward shoulder' },
    { key:'nk2', nameEn:'Neck Rotation',       nameAr:'دوران الرقبة', icon:'🔄',color:'#7c3aed', target:45, upThresh:30, downThresh:8, angle_type:'neck_rotation', descEn:'Rotate head slowly left and right' },
  ],
  back: [
    { key:'bk1', nameEn:'Back Extension',  nameAr:'مد الظهر',      icon:'🔙',color:'#10b981', target:30, upThresh:20, downThresh:5, angle_type:'back', descEn:'Extend back slowly while keeping hips stable' },
    { key:'bk2', nameEn:'Bridge Exercise', nameAr:'تمرين البريدج', icon:'🌉',color:'#0891b2', target:45, upThresh:35, downThresh:10, angle_type:'back', descEn:'Lift hips from lying position' },
  ],
};

export const MOCK_PATIENTS = [
  { id:'p1', name:'Ahmed Mohamed',  age:34, injury:'shoulder', status:'inprogress', sessions:8,  totalSessions:20, painLevel:6, lastSeen:'2h ago',  progress:40,  avatar:'AM', assignedDoctor:'d1' },
  { id:'p2', name:'Fatima Hassan',  age:28, injury:'knee',     status:'inprogress', sessions:14, totalSessions:24, painLevel:4, lastSeen:'1d ago',  progress:58,  avatar:'FH', assignedDoctor:'d1' },
  { id:'p3', name:'Mahmoud Samir', age:52, injury:'back',     status:'completed',  sessions:20, totalSessions:20, painLevel:2, lastSeen:'3d ago',  progress:100, avatar:'MS', assignedDoctor:'d1' },
  { id:'p4', name:'Noura Khaled',   age:26, injury:'neck',     status:'notstarted', sessions:0,  totalSessions:15, painLevel:7, lastSeen:'5m ago',  progress:0,   avatar:'NK', assignedDoctor:'d1' },
];

export const STATUS_CONFIG = {
  inprogress: { label:'In Progress', color:'#1a56db', bg:'#eff6ff' },
  completed:  { label:'Completed',   color:'#10b981', bg:'#ecfdf5' },
  notstarted: { label:'Not Started', color:'#6b7280', bg:'#f3f4f6' },
};

export const MOVEMENT_LIMITATIONS = [
  'Sitting for long','Walking upstairs','Stretching/Bending','Sleeping','Lifting objects','Reaching up',
];

export const INJURY_LABELS = { shoulder:'Shoulder', knee:'Knee', back:'Back', neck:'Neck' };
