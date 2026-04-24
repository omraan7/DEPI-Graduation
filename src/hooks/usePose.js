import { useRef, useCallback } from "react";
import { computeAngle, getActivePoints, LM, SKELETON_CONNECTIONS } from "../constants/exercises";

// ── Canvas drawing ─────────────────────────────────────────────
function drawScene(ctx, lm, W, H, angleType, side, angle, targetAngle, exColor) {
  const reached    = angle >= targetAngle * 0.9;
  const lineColor  = reached ? "#16a34a" : exColor;
  const activePts  = getActivePoints(angleType, side);

  // Connections
  SKELETON_CONNECTIONS.forEach(([a, b]) => {
    const pa = lm[LM[a]], pb = lm[LM[b]];
    if (!pa || !pb || (pa.visibility ?? 1) < 0.25) return;
    const isActive = activePts.includes(a) && activePts.includes(b);
    ctx.beginPath();
    ctx.moveTo(pa.x * W, pa.y * H);
    ctx.lineTo(pb.x * W, pb.y * H);
    ctx.strokeStyle = isActive ? lineColor : "rgba(148,163,184,0.4)";
    ctx.lineWidth   = isActive ? 5 : 2;
    ctx.stroke();
  });

  // Dots
  Object.entries(LM).forEach(([name, idx]) => {
    const pt = lm[idx];
    if (!pt || (pt.visibility ?? 1) < 0.25) return;
    const isActive = activePts.includes(name);
    ctx.beginPath();
    ctx.arc(pt.x * W, pt.y * H, isActive ? 9 : 4, 0, Math.PI * 2);
    ctx.fillStyle = isActive ? lineColor : "rgba(148,163,184,0.45)";
    ctx.fill();
    if (isActive) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  // Arc progress ring — drawn at the "vertex" point
  const vertexKey = getVertexKey(angleType, side);
  const vtx = vertexKey ? lm[LM[vertexKey]] : null;
  if (vtx) {
    const cx = vtx.x * W, cy = vtx.y * H, r = 44;
    // background ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI * 3 / 2);
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 7;
    ctx.stroke();
    // filled arc
    const pct = Math.min(1, angle / targetAngle);
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + pct * Math.PI * 2);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.stroke();
    // angle label
    ctx.fillStyle = lineColor;
    ctx.font = "bold 17px 'Cairo', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${angle}°`, cx, cy - r - 10);
    ctx.textAlign = "left";
  }
}

function getVertexKey(angleType, side) {
  switch (angleType) {
    case "shoulder":       return `${side}_shoulder`;
    case "knee":           return `${side}_knee`;
    case "neck_lateral":
    case "neck_rotation":
    case "neck_flexion":   return "nose";
    case "back":
    case "back_lateral":   return `${side}_hip`;
    default:               return null;
  }
}

// ── Hook ──────────────────────────────────────────────────────
export function usePose({ videoRef, canvasRef, exRef, sideRef, onFrame }) {
  const poseRef = useRef(null);
  const camRef  = useRef(null);

  const start = useCallback(async () => {
    if (!window.Pose || !window.Camera) return false;

    const pose = new window.Pose({
      locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}`,
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!canvas || !video) return;

      canvas.width  = video.videoWidth  || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!results.poseLandmarks) {
        onFrame(null);
        return;
      }

      const ex    = exRef.current;
      const side  = sideRef.current;
      const angle = computeAngle(results.poseLandmarks, ex.angle_type, side);

      drawScene(
        ctx, results.poseLandmarks,
        canvas.width, canvas.height,
        ex.angle_type, side, angle, ex.target, ex.color
      );

      onFrame(angle);
    });

    poseRef.current = pose;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const cam = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (poseRef.current)
            await poseRef.current.send({ image: videoRef.current });
        },
        width: 1280,
        height: 720,
      });
      cam.start();
      camRef.current = cam;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    camRef.current?.stop?.();
    const v = videoRef.current;
    if (v?.srcObject) v.srcObject.getTracks().forEach((t) => t.stop());
  }, []);

  return { start, stop };
}
