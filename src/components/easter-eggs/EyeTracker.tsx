import { useEffect, useRef, useState, useCallback } from 'react';

export function EyeTracker() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [status, setStatus] = useState<'loading' | 'calibrating' | 'tracking' | 'error'>('loading');
  const [calibrationPoints, setCalibrationPoints] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const lastFacePos = useRef<{ x: number; y: number } | null>(null);

  const CALIBRATION_NEEDED = 5;

  // Simple eye tracking using webcam + canvas face brightness analysis
  const trackFace = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      animRef.current = requestAnimationFrame(trackFace);
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const w = canvas.width;
    const h = canvas.height;
    if (w === 0 || h === 0) {
      animRef.current = requestAnimationFrame(trackFace);
      return;
    }

    // Sample the middle portion of the frame to find the brightest region (face)
    const faceRegion = ctx.getImageData(Math.floor(w * 0.1), Math.floor(h * 0.1), Math.floor(w * 0.8), Math.floor(h * 0.8));
    const data = faceRegion.data;
    const regionW = Math.floor(w * 0.8);
    const regionH = Math.floor(h * 0.8);

    // Divide into grid and find brightness center of mass
    const gridSize = 8;
    const cellW = Math.floor(regionW / gridSize);
    const cellH = Math.floor(regionH / gridSize);

    let totalBrightness = 0;
    let weightedX = 0;
    let weightedY = 0;

    for (let gy = 0; gy < gridSize; gy++) {
      for (let gx = 0; gx < gridSize; gx++) {
        let cellBrightness = 0;
        const startX = gx * cellW;
        const startY = gy * cellH;

        // Sample every 4th pixel for speed
        for (let y = startY; y < startY + cellH; y += 4) {
          for (let x = startX; x < startX + cellW; x += 4) {
            const i = (y * regionW + x) * 4;
            // Skin-tone detection: look for warm pixels
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const isSkinLike = r > 80 && g > 50 && b > 30 && r > g && r > b && (r - g) > 15;
            if (isSkinLike) {
              cellBrightness += r + g + b;
            }
          }
        }

        totalBrightness += cellBrightness;
        weightedX += cellBrightness * (gx + 0.5);
        weightedY += cellBrightness * (gy + 0.5);
      }
    }

    if (totalBrightness > 0) {
      // Normalized position 0-1 of face center
      const faceX = weightedX / totalBrightness / gridSize;
      const faceY = weightedY / totalBrightness / gridSize;

      // Webcam is mirrored, so invert X
      const screenX = faceX * window.innerWidth;
      const screenY = faceY * window.innerHeight;

      // Smooth the position
      if (lastFacePos.current) {
        const smooth = 0.7;
        lastFacePos.current = {
          x: lastFacePos.current.x * smooth + screenX * (1 - smooth),
          y: lastFacePos.current.y * smooth + screenY * (1 - smooth),
        };
      } else {
        lastFacePos.current = { x: screenX, y: screenY };
      }

      setPos({ x: lastFacePos.current.x, y: lastFacePos.current.y });
    }

    animRef.current = requestAnimationFrame(trackFace);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 320, height: 240 },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const video = document.createElement('video');
        video.srcObject = stream;
        video.setAttribute('playsinline', '');
        video.muted = true;
        await video.play();

        videoRef.current = video;
        canvasRef.current = document.createElement('canvas');

        setStatus('tracking');
        animRef.current = requestAnimationFrame(trackFace);
      } catch (e) {
        console.error('Eye tracker camera error:', e);
        if (!cancelled) setStatus('error');
      }
    }

    init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animRef.current);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    };
  }, [trackFace]);

  // Handle calibration clicks
  useEffect(() => {
    if (status !== 'calibrating') return;
    const handler = () => {
      setCalibrationPoints((p) => {
        if (p + 1 >= CALIBRATION_NEEDED) {
          setStatus('tracking');
        }
        return p + 1;
      });
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [status]);

  if (status === 'error') return null;

  if (status === 'loading') {
    return (
      <div
        style={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 8,
          fontSize: 13,
          fontFamily: 'Arial, sans-serif',
          pointerEvents: 'none',
        }}
      >
        Starting eye tracker...
      </div>
    );
  }

  if (!pos) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: pos.x - 12,
        top: pos.y - 12,
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #ff0040 0%, #ff004088 60%, transparent 100%)',
        boxShadow: '0 0 12px 4px rgba(255, 0, 64, 0.4)',
        pointerEvents: 'none',
        zIndex: 10000,
        transition: 'left 0.05s linear, top 0.05s linear',
      }}
    />
  );
}
