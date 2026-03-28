import { useState, useCallback, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import * as THREE from 'three';

interface BottleFlipProps {
  onConfirm: () => void;
  onCancel: () => void;
}

type FlipState = 'idle' | 'flipping' | 'checking' | 'landed' | 'failed';

/* ── Webcam motion detector ── */
function useWebcamMotion(onFlick: () => void, enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevFrameRef = useRef<ImageData | null>(null);
  const animRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const cooldownRef = useRef(false);
  const onFlickRef = useRef(onFlick);
  onFlickRef.current = onFlick;

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 120, height: 90, frameRate: 30 },
      });
      streamRef.current = stream;

      const video = document.createElement('video');
      video.srcObject = stream;
      video.playsInline = true;
      video.muted = true;
      await video.play();
      videoRef.current = video;

      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 90;
      canvasRef.current = canvas;

      setWebcamActive(true);
    } catch {
      // Camera denied or unavailable
      setWebcamActive(false);
    }
  }, []);

  const stop = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    videoRef.current = null;
    prevFrameRef.current = null;
    setWebcamActive(false);
  }, []);

  // Start webcam when enabled
  useEffect(() => {
    if (enabled) {
      start();
    }
    return stop;
  }, [enabled, start, stop]);

  // Frame comparison loop
  useEffect(() => {
    if (!webcamActive) return;

    const detect = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        animRef.current = requestAnimationFrame(detect);
        return;
      }

      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(video, 0, 0, 120, 90);
      const currentFrame = ctx.getImageData(0, 0, 120, 90);

      if (prevFrameRef.current) {
        const prev = prevFrameRef.current.data;
        const curr = currentFrame.data;

        // Compare top half vs bottom half motion to detect upward movement
        let topMotion = 0;
        let bottomMotion = 0;
        const midY = 45; // half of 90

        for (let y = 0; y < 90; y++) {
          for (let x = 0; x < 120; x += 3) {
            // Sample every 3rd pixel for performance
            const i = (y * 120 + x) * 4;
            const diff =
              Math.abs(curr[i] - prev[i]) +
              Math.abs(curr[i + 1] - prev[i + 1]) +
              Math.abs(curr[i + 2] - prev[i + 2]);

            if (diff > 60) {
              // Significant pixel change
              if (y < midY) {
                topMotion++;
              } else {
                bottomMotion++;
              }
            }
          }
        }

        // Upward flick: lots of motion, and more in the top half
        // (object moving up creates more change in top region of frame)
        const totalMotion = topMotion + bottomMotion;
        const hasSignificantMotion = totalMotion > 150;
        const isUpward = topMotion > bottomMotion * 1.2;

        if (hasSignificantMotion && isUpward && !cooldownRef.current) {
          cooldownRef.current = true;
          onFlickRef.current();
          setTimeout(() => {
            cooldownRef.current = false;
          }, 1500);
        }
      }

      prevFrameRef.current = currentFrame;
      animRef.current = requestAnimationFrame(detect);
    };

    animRef.current = requestAnimationFrame(detect);
    return () => cancelAnimationFrame(animRef.current);
  }, [webcamActive]);

  return webcamActive;
}

/* ── Ground ── */
function Ground() {
  const [ref] = usePlane<THREE.Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -2.5, 0],
    material: { friction: 0.9, restitution: 0.08 },
  }));
  return (
    <mesh ref={ref}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}

/* ── Bottle ── */
function Bottle({
  flipState,
  onResult,
}: {
  flipState: FlipState;
  onResult: (landed: boolean) => void;
}) {
  const bottleHeight = 1.8;
  const bottleRadius = 0.4;
  const [ref, api] = useBox<THREE.Group>(() => ({
    mass: 1,
    position: [0, -1.5, 0],
    args: [bottleRadius * 2, bottleHeight, bottleRadius * 2],
    material: { friction: 0.9, restitution: 0.08 },
    angularDamping: 0.4,
    linearDamping: 0.05,
  }));

  const velocityRef = useRef([0, 0, 0]);
  const angularRef = useRef([0, 0, 0]);
  const quaternionRef = useRef([0, 0, 0, 1]);
  const settledFrames = useRef(0);
  const hasChecked = useRef(false);
  const flipStartTime = useRef(0);

  useEffect(() => {
    const unsubs = [
      api.velocity.subscribe((v) => (velocityRef.current = v)),
      api.angularVelocity.subscribe((v) => (angularRef.current = v)),
      api.quaternion.subscribe((q) => (quaternionRef.current = q)),
    ];
    return () => unsubs.forEach((u) => u());
  }, [api]);

  useEffect(() => {
    if (flipState === 'flipping') {
      hasChecked.current = false;
      settledFrames.current = 0;
      flipStartTime.current = Date.now();

      api.position.set(0, -1.5, 0);
      api.rotation.set(0, 0, 0);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);

      setTimeout(() => {
        const flipSpeed = (0.8 + Math.random() * 0.5) * Math.PI * 2;
        const flipDirection = Math.random() > 0.5 ? 1 : -1;

        api.velocity.set(
          (Math.random() - 0.5) * 0.3,
          9 + Math.random() * 2,
          0
        );
        api.angularVelocity.set(
          flipDirection * flipSpeed,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        );
      }, 50);
    }
  }, [flipState, api]);

  const checkLanding = useCallback(() => {
    const q = new THREE.Quaternion(...quaternionRef.current);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    const dotUp = up.dot(new THREE.Vector3(0, 1, 0));
    return Math.abs(dotUp) > 0.75;
  }, []);

  useFrame(() => {
    if (flipState !== 'checking' && flipState !== 'flipping') return;
    if (hasChecked.current) return;

    const elapsed = Date.now() - flipStartTime.current;

    if (elapsed > 4000) {
      hasChecked.current = true;
      onResult(checkLanding());
      return;
    }

    if (elapsed < 600) return;

    const [vx, vy, vz] = velocityRef.current;
    const [ax, ay, az] = angularRef.current;
    const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
    const angSpeed = Math.sqrt(ax * ax + ay * ay + az * az);

    if (speed < 0.25 && angSpeed < 0.35) {
      settledFrames.current++;
    } else {
      settledFrames.current = Math.max(0, settledFrames.current - 2);
    }

    if (settledFrames.current > 25) {
      hasChecked.current = true;
      onResult(checkLanding());
    }
  });

  return (
    <group ref={ref} castShadow>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[bottleRadius * 0.85, bottleRadius, bottleHeight, 16]} />
        <meshStandardMaterial color="#4fc3f7" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, bottleHeight / 2 + 0.08, 0]} castShadow>
        <cylinderGeometry args={[bottleRadius * 0.35, bottleRadius * 0.4, 0.18, 12]} />
        <meshStandardMaterial color="#1565c0" />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[bottleRadius * 0.87, bottleRadius * 1.01, 0.7, 16]} />
        <meshStandardMaterial color="#e3f2fd" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[bottleRadius * 0.75, bottleRadius * 0.9, bottleHeight * 0.55, 16]} />
        <meshStandardMaterial color="#0288d1" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/* ── Scene ── */
function BottleScene({
  flipState,
  onFlipStateChange,
  onResult,
  onClickScene,
}: {
  flipState: FlipState;
  onFlipStateChange: (s: FlipState) => void;
  onResult: (landed: boolean) => void;
  onClickScene: () => void;
}) {
  useEffect(() => {
    if (flipState === 'flipping') {
      const timer = setTimeout(() => onFlipStateChange('checking'), 400);
      return () => clearTimeout(timer);
    }
  }, [flipState, onFlipStateChange]);

  return (
    <Canvas
      shadows
      gl={{ alpha: true }}
      camera={{ position: [0, 1, 7], fov: 45 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      onPointerDown={onClickScene}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1} castShadow />
      <pointLight position={[-3, 5, -3]} intensity={0.3} />

      <Physics gravity={[0, -12, 0]}>
        <Ground />
        <Bottle flipState={flipState} onResult={onResult} />
      </Physics>
    </Canvas>
  );
}

/* ── Main component ── */
export function BottleFlip({ onConfirm, onCancel }: BottleFlipProps) {
  const [state, setState] = useState<FlipState>('idle');
  const [hasMotion, setHasMotion] = useState(false);
  const [motionPermission, setMotionPermission] = useState<
    'unknown' | 'granted' | 'denied'
  >('unknown');
  const stateRef = useRef(state);
  stateRef.current = state;
  const attemptCount = useRef(0);

  const doFlip = useCallback(() => {
    if (
      stateRef.current === 'flipping' ||
      stateRef.current === 'checking' ||
      stateRef.current === 'landed'
    )
      return;
    attemptCount.current++;
    setState('flipping');
  }, []);

  const handleResult = useCallback(
    (landed: boolean) => {
      const forceSuccess = attemptCount.current >= 3;
      if (landed || forceSuccess) {
        setState('landed');
        setTimeout(onConfirm, 800);
      } else {
        setState('failed');
      }
    },
    [onConfirm]
  );

  // ── Device motion (mobile) ──
  useEffect(() => {
    const DME = DeviceMotionEvent as typeof DeviceMotionEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof DME.requestPermission === 'function') {
      setMotionPermission('unknown');
    } else if ('DeviceMotionEvent' in window) {
      setMotionPermission('granted');
    } else {
      setMotionPermission('denied');
    }
  }, []);

  const requestMotionPermission = useCallback(async () => {
    const DME = DeviceMotionEvent as typeof DeviceMotionEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof DME.requestPermission === 'function') {
      try {
        const result = await DME.requestPermission();
        setMotionPermission(result);
      } catch {
        setMotionPermission('denied');
      }
    }
  }, []);

  useEffect(() => {
    if (motionPermission !== 'granted') return;

    let lastY = 0;
    let cooldown = false;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.y === null) return;

      setHasMotion(true);

      const y = acc.y;
      const delta = y - lastY;
      lastY = y;

      if (delta > 15 && !cooldown) {
        cooldown = true;
        doFlip();
        setTimeout(() => {
          cooldown = false;
        }, 1500);
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [motionPermission, doFlip]);

  // ── Webcam motion (desktop fallback) ──
  // Only enable webcam if no device motion detected
  const useWebcam = !hasMotion;
  const webcamActive = useWebcamMotion(doFlip, useWebcam);

  // ── ESC to cancel ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  const handleOverlayClick = useCallback(() => {
    if (motionPermission === 'unknown') {
      requestMotionPermission();
      return;
    }
    // Click still works as fallback
    doFlip();
  }, [motionPermission, requestMotionPermission, doFlip]);

  const hintText = hasMotion
    ? '☝️ Flick your phone upward'
    : webcamActive
      ? '👋 Wave your hand upward in front of the camera'
      : null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001,
        cursor:
          state === 'flipping' || state === 'checking' ? 'wait' : 'pointer',
      }}
    >
      {/* Hint */}
      {hintText && (state === 'idle' || state === 'failed') && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            color: 'rgba(0,0,0,0.3)',
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            pointerEvents: 'none',
            animation: 'shakeHint 1.5s ease-in-out infinite',
          }}
        >
          {hintText}
        </div>
      )}

      {/* Webcam indicator */}
      {webcamActive && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#4CAF50',
              animation: 'blink 1.5s ease-in-out infinite',
            }}
          />
          Camera tracking motion
        </div>
      )}

      <BottleScene
        flipState={state}
        onFlipStateChange={setState}
        onResult={handleResult}
        onClickScene={handleOverlayClick}
      />
      <style>{`
        @keyframes shakeHint {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-12px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
