// ─────────────────────────────────────────────
// LANDMARK INDICES  (MediaPipe Pose)
// ─────────────────────────────────────────────
export const LM = {
  left_shoulder:  11, right_shoulder: 12,
  left_elbow:     13, right_elbow:    14,
  left_wrist:     15, right_wrist:    16,
  left_hip:       23, right_hip:      24,
  left_knee:      25, right_knee:     26,
  left_ankle:     27, right_ankle:    28,
  nose:            0,
  left_ear:        7, right_ear:       8,
};

export const SKELETON_CONNECTIONS = [
  ["left_shoulder",  "right_shoulder"],
  ["left_shoulder",  "left_elbow"],
  ["left_elbow",     "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow",    "right_wrist"],
  ["left_shoulder",  "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip",       "right_hip"],
  ["left_hip",       "left_knee"],
  ["left_knee",      "left_ankle"],
  ["right_hip",      "right_knee"],
  ["right_knee",     "right_ankle"],
];

// ─────────────────────────────────────────────
// INJURY TYPES
// ─────────────────────────────────────────────
export const INJURY_TYPES = {
  shoulder: { id: "shoulder", nameAr: "كتف", icon: "🦴" },
  knee:     { id: "knee",     nameAr: "ركبة", icon: "🦵" },
  neck:     { id: "neck",     nameAr: "رقبة", icon: "↕"  },
  back:     { id: "back",     nameAr: "ظهر",  icon: "🔙" },
};

// ─────────────────────────────────────────────
// EXERCISE DEFINITIONS PER INJURY
// ─────────────────────────────────────────────

// angle_type: which angle formula to use
//   "shoulder" → hip→shoulder→elbow
//   "knee"     → hip→knee→ankle
//   "neck"     → ear→shoulder (tilt approximation)

export const EXERCISES_BY_INJURY = {

  // ── SHOULDER ─────────────────────────────────
  shoulder: [
    {
      key:        "shoulder_abduction",
      nameAr:     "رفع جانبي",
      icon:       "↔",
      color:      "#2563eb",
      target:     90,
      upThresh:   65,
      downThresh: 20,
      angle_type: "shoulder",
      descAr:     "ارفع ذراعك على الجانب حتى مستوى الكتف",
    },
    {
      key:        "shoulder_flexion",
      nameAr:     "رفع للأمام",
      icon:       "↑",
      color:      "#d97706",
      target:     120,
      upThresh:   90,
      downThresh: 30,
      angle_type: "shoulder",
      descAr:     "ارفع ذراعك للأمام ببطء فوق مستوى الكتف",
    },
    {
      key:        "shoulder_overhead",
      nameAr:     "رفع كامل",
      icon:       "🙌",
      color:      "#7c3aed",
      target:     180,
      upThresh:   140,
      downThresh: 50,
      angle_type: "shoulder",
      descAr:     "ارفع ذراعك بالكامل فوق الرأس",
    },
  ],

  // // ── KNEE ─────────────────────────────────────
  // knee: [
  //   {
  //     key:        "knee_flexion",
  //     nameAr:     "ثني الركبة",
  //     icon:       "🦵",
  //     color:      "#16a34a",
  //     target:     90,
  //     upThresh:   65,
  //     downThresh: 20,
  //     angle_type: "knee",
  //     descAr:     "ثني الركبة ببطء من الوقوف وإعادتها للوضع الطبيعي",
  //   },
  //   {
  //     key:        "knee_extension",
  //     nameAr:     "مد الركبة",
  //     icon:       "📏",
  //     color:      "#0891b2",
  //     target:     170,
  //     upThresh:   140,
  //     downThresh: 60,
  //     angle_type: "knee",
  //     descAr:     "مد الركبة بالكامل من وضع الجلوس حتى تصبح مستقيمة",
  //   },
  //   {
  //     key:        "knee_squat",
  //     nameAr:     "نصف قرفصاء",
  //     icon:       "⬇",
  //     color:      "#dc2626",
  //     target:     60,
  //     upThresh:   50,
  //     downThresh: 15,
  //     angle_type: "knee",
  //     descAr:     "انحن ببطء حتى زاوية 60° ثم ارجع للوضع المستقيم",
  //   },
  // ],

  // // ── NECK ─────────────────────────────────────
  // neck: [
  //   {
  //     key:        "neck_lateral",
  //     nameAr:     "إمالة جانبية",
  //     icon:       "↔",
  //     color:      "#db2777",
  //     target:     40,
  //     upThresh:   28,
  //     downThresh: 8,
  //     angle_type: "neck_lateral",
  //     descAr:     "أمل رأسك ببطء نحو الكتف الأيمن ثم الأيسر",
  //   },
  //   {
  //     key:        "neck_rotation",
  //     nameAr:     "دوران الرقبة",
  //     icon:       "🔄",
  //     color:      "#7c3aed",
  //     target:     45,
  //     upThresh:   30,
  //     downThresh: 8,
  //     angle_type: "neck_rotation",
  //     descAr:     "أدر رأسك ببطء يميناً ويساراً دون تحريك الكتفين",
  //   },
  //   {
  //     key:        "neck_flexion",
  //     nameAr:     "ثني الرقبة",
  //     icon:       "↓",
  //     color:      "#d97706",
  //     target:     35,
  //     upThresh:   25,
  //     downThresh: 8,
  //     angle_type: "neck_flexion",
  //     descAr:     "أمل رأسك للأمام ببطء حتى تقترب ذقنك من صدرك",
  //   },
  // ],

  // // ── BACK ─────────────────────────────────────
  // back: [
  //   {
  //     key:        "back_extension",
  //     nameAr:     "مد الظهر",
  //     icon:       "🔙",
  //     color:      "#16a34a",
  //     target:     30,
  //     upThresh:   20,
  //     downThresh: 5,
  //     angle_type: "back",
  //     descAr:     "مد الظهر للخلف ببطء مع إبقاء الحوض ثابتاً",
  //   },
  //   {
  //     key:        "back_lateral",
  //     nameAr:     "إمالة جانبية",
  //     icon:       "↔",
  //     color:      "#0891b2",
  //     target:     30,
  //     upThresh:   20,
  //     downThresh: 5,
  //     angle_type: "back_lateral",
  //     descAr:     "أمل جذعك ببطء للجانب دون تحريك الحوض",
  //   },
  // ],
};

// ─────────────────────────────────────────────
// ANGLE CALCULATION FUNCTIONS
// ─────────────────────────────────────────────

function vecAngle(a, b, c) {
  // angle at vertex B between A–B–C
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const mag = Math.sqrt(ab.x ** 2 + ab.y ** 2) * Math.sqrt(cb.x ** 2 + cb.y ** 2);
  if (mag === 0) return 0;
  return Math.round(Math.acos(Math.min(1, Math.max(-1, dot / mag))) * (180 / Math.PI));
}

/**
 * Compute the exercise angle from MediaPipe landmarks.
 * @param {Array}  landmarks  - raw pose landmark array
 * @param {string} angleType  - one of the angle_type values
 * @param {string} side       - "left" | "right"
 * @returns {number} angle in degrees
 */
export function computeAngle(landmarks, angleType, side) {
  const s = side; // "left" | "right"

  switch (angleType) {

    // shoulder: hip → shoulder → elbow
    case "shoulder": {
      const hip      = landmarks[LM[`${s}_hip`]];
      const shoulder = landmarks[LM[`${s}_shoulder`]];
      const elbow    = landmarks[LM[`${s}_elbow`]];
      if (!hip || !shoulder || !elbow) return 0;
      if ((shoulder.visibility ?? 1) < 0.4) return 0;
      return vecAngle(hip, shoulder, elbow);
    }

    // knee: hip → knee → ankle
    case "knee": {
      const hip   = landmarks[LM[`${s}_hip`]];
      const knee  = landmarks[LM[`${s}_knee`]];
      const ankle = landmarks[LM[`${s}_ankle`]];
      if (!hip || !knee || !ankle) return 0;
      if ((knee.visibility ?? 1) < 0.4) return 0;
      return vecAngle(hip, knee, ankle);
    }

    // neck lateral tilt: measure horizontal offset ratio of nose vs mid-shoulder
    case "neck_lateral": {
      const nose   = landmarks[LM.nose];
      const lSh    = landmarks[LM.left_shoulder];
      const rSh    = landmarks[LM.right_shoulder];
      if (!nose || !lSh || !rSh) return 0;
      const midX   = (lSh.x + rSh.x) / 2;
      const midY   = (lSh.y + rSh.y) / 2;
      const dx     = nose.x - midX;
      const dy     = midY  - nose.y; // positive = nose above shoulders
      return Math.abs(Math.round(Math.atan2(Math.abs(dx), Math.max(dy, 0.01)) * (180 / Math.PI)));
    }

    // neck rotation: horizontal distance between ears (normalised by shoulder width)
    case "neck_rotation": {
      const lEar = landmarks[LM.left_ear];
      const rEar = landmarks[LM.right_ear];
      const lSh  = landmarks[LM.left_shoulder];
      const rSh  = landmarks[LM.right_shoulder];
      if (!lEar || !rEar || !lSh || !rSh) return 0;
      const earSpan  = Math.abs(lEar.x - rEar.x);
      const shSpan   = Math.abs(lSh.x  - rSh.x);
      if (shSpan < 0.01) return 0;
      // when looking straight: earSpan ≈ shSpan → ratio ≈ 1 → angle ≈ 0
      // when rotated fully: earSpan shrinks → angle increases
      const ratio = Math.min(1, earSpan / shSpan);
      return Math.round(Math.acos(ratio) * (180 / Math.PI));
    }

     case "neck_flexion": {
      const nose = landmarks[LM.nose];
      const lSh  = landmarks[LM.left_shoulder];
      const rSh  = landmarks[LM.right_shoulder];
      if (!nose || !lSh || !rSh) return 0;
      const midX = (lSh.x + rSh.x) / 2;
      const midY = (lSh.y + rSh.y) / 2;
      const dx   = nose.x - midX;
      const dy   = midY  - nose.y;
      return Math.abs(Math.round(Math.atan2(Math.abs(dx), Math.max(dy, 0.01)) * (180 / Math.PI)));
    }

    // back extension / lateral — use shoulder vs hip relative positions
    case "back":
    case "back_lateral": {
      const lSh  = landmarks[LM.left_shoulder];
      const rSh  = landmarks[LM.right_shoulder];
      const lHip = landmarks[LM[`${s}_hip`]];
      if (!lSh || !rSh || !lHip) return 0;
      const midShX = (lSh.x + rSh.x) / 2;
      const midShY = (lSh.y + rSh.y) / 2;
      const dx     = midShX - lHip.x;
      const dy     = lHip.y - midShY;
      return Math.abs(Math.round(Math.atan2(Math.abs(dx), Math.max(dy, 0.01)) * (180 / Math.PI)));
    }

    default:
      return 0;
  }
}

 // ACTIVE LANDMARK NAMES FOR DRAWING
 export function getActivePoints(angleType, side) {
  switch (angleType) {
    case "shoulder":
      return [`${side}_hip`, `${side}_shoulder`, `${side}_elbow`, `${side}_wrist`];
    case "knee":
      return [`${side}_hip`, `${side}_knee`, `${side}_ankle`];
    case "neck_lateral":
    case "neck_rotation":
    case "neck_flexion":
      return ["left_shoulder", "right_shoulder", "left_ear", "right_ear", "nose"];
    case "back":
    case "back_lateral":
      return ["left_shoulder", "right_shoulder", `${side}_hip`];
    default:
      return [];
  }
}
