import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

interface PokemonGoOverlayProps {
  onDismiss: () => void;
  requiredClicks?: number;
  featureName?: string;
}

type Phase = 'idle' | 'throwing' | 'rolling' | 'caught';

interface GeneratedPokemon {
  name: string;
  cp: number;
  type1: string;
  type2: string;
  type1Color: string;
  type2Color: string;
  hp: number;
  attack: number;
  defense: number;
  flavorText: string;
  weight: string;
  height: string;
  stardust: number;
  candy: number;
  candyXL: number;
  dateCaught: string;
}

const ADJECTIVES = ['Dabbing', 'Harambe-kin', 'Damn', 'Bottle-flippin', 'Netflix-chillin', 'Triggered', 'Lit', 'Woke', 'Salty', 'Extra', 'Yeet', 'Savage'];
const NOUNS = ['Daniel', 'Pepe', 'Harambe', 'Clown', 'Fidget', 'Ken Bone', 'DatBoi', 'Arthur', 'Rick', 'Bee', 'Deez', 'Vine'];
const TYPES: { name: string; color: string }[] = [
  { name: 'Meme', color: '#A855F7' },
  { name: 'Dank', color: '#6D28D9' },
  { name: 'Vine', color: '#16A34A' },
  { name: 'Cringe', color: '#DC2626' },
  { name: 'Wholesome', color: '#F472B6' },
  { name: 'Savage', color: '#EA580C' },
  { name: 'Slay', color: '#E91E63' },
  { name: 'Basic', color: '#9CA3AF' },
  { name: 'Woke', color: '#2563EB' },
  { name: 'Lit', color: '#EAB308' },
  { name: 'Normie', color: '#78716C' },
  { name: 'Fire', color: '#EF4444' },
];
const FLAVOR_TEXTS = [
  'Discovered blocking traffic while catching Pokémon at a Pokéstop.',
  'This Pokémon was last seen dabbing on the haters in 2016.',
  'Favorite move: Bottle Flip. It never lands.',
  'Was spotted near the Cincinnati Zoo. We don\'t talk about it.',
  'Evolves when exposed to a Vine compilation.',
  'Its cries sound like "damn Daniel, back at it again!"',
  'Hatched from a 10km egg after walking through 3 parking lots.',
  'Known to crash servers wherever it appears.',
  'Only appears when your phone battery is below 5%.',
  'Extremely rare. Usually found staring at a phone screen.',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const TAG_LABELS = ['Mega', 'Raid Boss', 'Mostly Ghostly', 'Gigantimax', 'Shadow', 'Purified', 'Lucky', 'Shiny', 'Best Buddy', 'Mythical'];

function generatePokemon(): GeneratedPokemon {
  let t1 = pick(TYPES);
  let t2 = pick(TYPES);
  while (t2.name === t1.name) t2 = pick(TYPES);
  return {
    name: pick(ADJECTIVES) + pick(NOUNS),
    cp: Math.floor(Math.random() * 4000) + 100,
    type1: t1.name,
    type2: t2.name,
    type1Color: t1.color,
    type2Color: t2.color,
    hp: Math.floor(Math.random() * 280) + 20,
    attack: Math.floor(Math.random() * 15) + 1,
    defense: Math.floor(Math.random() * 15) + 1,
    flavorText: pick(FLAVOR_TEXTS),
    weight: (Math.random() * 80 + 30).toFixed(2) + 'kg',
    height: (Math.random() * 1.2 + 0.8).toFixed(2) + 'm',
    stardust: Math.floor(Math.random() * 2000000) + 10000,
    candy: Math.floor(Math.random() * 2000) + 50,
    candyXL: Math.floor(Math.random() * 300),
    dateCaught: '2016/' + String(Math.floor(Math.random() * 12) + 1).padStart(2, '0') + '/' + String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'),
  };
}

function generateTags(): string[] {
  const count = Math.floor(Math.random() * 3) + 2;
  const shuffled = [...TAG_LABELS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const TAG_COLORS = ['#A855F7', '#E91E63', '#8B5CF6', '#EAB308', '#06B6D4', '#F97316'];

// ─── Three.js Pokeball Mesh ───

function PokeballModel({ phase, onRollComplete }: { phase: Phase; onRollComplete: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const hasCompletedRef = useRef(false);

  // Animation state refs
  const throwStartRef = useRef(0);
  const rollStartRef = useRef(0);
  const phaseRef = useRef(phase);

  useEffect(() => {
    phaseRef.current = phase;
    if (phase === 'throwing') {
      throwStartRef.current = 0;
      timeRef.current = 0;
    }
    if (phase === 'rolling') {
      rollStartRef.current = 0;
      hasCompletedRef.current = false;
    }
  }, [phase]);

  // Build pokeball geometry with useMemo
  const pokeballGroup = useMemo(() => {
    const group = new THREE.Group();

    // Sphere geometry for the ball
    const radius = 0.5;
    const segments = 64;

    // Red top half
    const topGeo = new THREE.SphereGeometry(radius, segments, segments, 0, Math.PI * 2, 0, Math.PI / 2);
    const topMat = new THREE.MeshStandardMaterial({
      color: '#CC0000',
      roughness: 0.25,
      metalness: 0.1,
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    group.add(topMesh);

    // White bottom half
    const botGeo = new THREE.SphereGeometry(radius, segments, segments, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const botMat = new THREE.MeshStandardMaterial({
      color: '#F0F0F0',
      roughness: 0.25,
      metalness: 0.05,
    });
    const botMesh = new THREE.Mesh(botGeo, botMat);
    group.add(botMesh);

    // Black center band (torus)
    const bandGeo = new THREE.TorusGeometry(radius * 0.98, 0.025, 16, 64);
    const bandMat = new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      roughness: 0.5,
      metalness: 0.3,
    });
    const bandMesh = new THREE.Mesh(bandGeo, bandMat);
    bandMesh.rotation.x = Math.PI / 2;
    group.add(bandMesh);

    // Center button - outer ring
    const ringGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: '#222222',
      roughness: 0.4,
      metalness: 0.5,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.z = radius * 0.97;
    group.add(ringMesh);

    // Center button - white face
    const btnGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.07, 32);
    const btnMat = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      roughness: 0.2,
      metalness: 0.2,
    });
    const btnMesh = new THREE.Mesh(btnGeo, btnMat);
    btnMesh.rotation.x = Math.PI / 2;
    btnMesh.position.z = radius * 0.98;
    group.add(btnMesh);

    // Back button (mirrored)
    const ringBack = ringMesh.clone();
    ringBack.position.z = -radius * 0.97;
    group.add(ringBack);
    const btnBack = btnMesh.clone();
    btnBack.position.z = -radius * 0.98;
    group.add(btnBack);

    return group;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const g = groupRef.current;

    if (phaseRef.current === 'idle') {
      // Gentle floating bob
      timeRef.current += delta;
      g.position.y = Math.sin(timeRef.current * 2) * 0.15;
      g.position.z = 0;
      g.rotation.y += delta * 0.5;
    }

    if (phaseRef.current === 'throwing') {
      throwStartRef.current += delta;
      const t = throwStartRef.current;
      const duration = 1.2;
      const progress = Math.min(t / duration, 1);

      // Ball flies toward camera (z increases toward viewer)
      // Ease-in curve for acceleration feel
      const eased = progress * progress;
      g.position.z = eased * 8;
      // Arc upward then down
      g.position.y = Math.sin(progress * Math.PI) * 1.5 - progress * 0.5;
      // Scale up as it approaches
      const scale = 1 + eased * 3;
      g.scale.setScalar(scale);
      // Spin while flying
      g.rotation.x += delta * 12;
      g.rotation.z += delta * 3;
    }

    if (phaseRef.current === 'rolling') {
      rollStartRef.current += delta;
      const t = rollStartRef.current;

      // Reset scale and position for ground rolling
      g.scale.setScalar(1);

      // Rolling on the ground: starts from right, rolls to center, decelerates
      const rollDuration = 3.0;
      const progress = Math.min(t / rollDuration, 1);

      // Deceleration curve
      const decel = 1 - Math.pow(1 - progress, 0.5);

      // Roll from right side to center
      g.position.x = 3 * (1 - decel) - 0;
      g.position.y = -0.5; // on the ground
      g.position.z = 2; // in front of camera a bit

      // Spin proportional to velocity (faster at start, slower at end)
      const velocity = Math.max(0, 1 - progress);
      g.rotation.z -= velocity * delta * 10;

      // Add wobble as it slows down
      if (progress > 0.6) {
        const wobbleIntensity = (progress - 0.6) / 0.4;
        g.rotation.x = Math.sin(t * 8) * 0.15 * (1 - wobbleIntensity);
      }

      // 3 shakes at the end
      if (progress > 0.7) {
        const shakeT = (progress - 0.7) / 0.3;
        const shakeAngle = Math.sin(shakeT * Math.PI * 6) * 0.2 * (1 - shakeT);
        g.rotation.z = shakeAngle;
      }

      if (progress >= 1 && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        g.rotation.set(0, 0, 0);
        onRollComplete();
      }
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={pokeballGroup} />
    </group>
  );
}

function PokeballScene({ phase, onRollComplete, onClick }: { phase: Phase; onRollComplete: () => void; onClick: () => void }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      style={{
        position: 'absolute',
        inset: 0,
        cursor: phase === 'idle' ? 'pointer' : 'default',
      }}
      onClick={phase === 'idle' ? onClick : undefined}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} castShadow />
      <directionalLight position={[-2, 3, -1]} intensity={0.3} color="#88aaff" />
      <pointLight position={[0, -2, 3]} intensity={0.5} color="#ffffff" />
      <Environment preset="city" />
      <PokeballModel phase={phase} onRollComplete={onRollComplete} />
    </Canvas>
  );
}

// ─── Main Overlay ───

export function PokemonGoOverlay({ onDismiss }: PokemonGoOverlayProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [pokemonData, setPokemonData] = useState<GeneratedPokemon | null>(null);
  const [tags] = useState(() => generateTags());
  const [showFlash, setShowFlash] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const snapPhoto = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 300, height: 300 } });
      streamRef.current = stream;
      const video = document.createElement('video');
      video.srcObject = stream;
      video.playsInline = true;
      await video.play();
      await new Promise(r => setTimeout(r, 300));
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 300;
      canvas.height = video.videoHeight || 300;
      canvas.getContext('2d')!.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedPhoto(dataUrl);
      cleanup();
    } catch {
      setCapturedPhoto(null);
      cleanup();
    }
  }, [cleanup]);

  const handleThrow = useCallback(() => {
    if (phase !== 'idle') return;
    setPokemonData(generatePokemon());
    setPhase('throwing');
    snapPhoto();

    // After throw animation (ball reaches camera), flash and transition to rolling
    setTimeout(() => {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 300);
      setPhase('rolling');
    }, 1200);
  }, [phase, snapPhoto]);

  const handleRollComplete = useCallback(() => {
    // Short delay after roll stops, then show card
    setTimeout(() => {
      setPhase('caught');
    }, 500);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      background: phase === 'caught'
        ? 'rgba(0,0,0,0.85)'
        : 'linear-gradient(180deg, #4FC3F7 0%, #81C784 60%, #66BB6A 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      fontFamily: 'Arial, sans-serif',
    }}>

      {/* 3D Pokeball scene — visible during idle, throwing, and rolling */}
      {phase !== 'caught' && (
        <>
          <PokeballScene
            phase={phase}
            onRollComplete={handleRollComplete}
            onClick={handleThrow}
          />

          {/* Text overlays on top of 3D scene */}
          {phase === 'idle' && (
            <div style={{
              position: 'absolute',
              top: '12%',
              textAlign: 'center',
              pointerEvents: 'none',
            }}>
              <p style={{
                color: 'white',
                fontSize: 28,
                fontWeight: 'bold',
                textShadow: '2px 2px 6px rgba(0,0,0,0.4)',
                marginBottom: 8,
              }}>
                A wild YOU appeared!
              </p>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: 14,
                textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
              }}>
                Click the Pokéball to catch!
              </p>
            </div>
          )}

          {phase === 'rolling' && (
            <div style={{
              position: 'absolute',
              top: '10%',
              textAlign: 'center',
              pointerEvents: 'none',
            }}>
              <p style={{
                color: 'white',
                fontSize: 22,
                fontWeight: 'bold',
                textShadow: '2px 2px 6px rgba(0,0,0,0.4)',
                animation: 'pulse 1s ease-in-out infinite',
              }}>
                ...
              </p>
            </div>
          )}
        </>
      )}

      {/* Screen flash */}
      {showFlash && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'white',
          zIndex: 10001,
          animation: 'flashFade 0.3s ease-out forwards',
          pointerEvents: 'none',
        }} />
      )}

      {/* === CAUGHT PHASE — Pokemon GO mobile UI === */}
      {phase === 'caught' && pokemonData && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.8)',
          animation: 'fadeIn 0.4s ease-out',
        }}>
          {/* Phone frame — 9:19.5 ratio like real mobile */}
          <div style={{
            width: 'min(380px, 90vw)',
            height: 'min(823px, 92vh)',
            borderRadius: 36,
            overflow: 'hidden',
            background: '#000',
            boxShadow: '0 0 60px rgba(0,0,0,0.6), 0 0 0 3px #333, 0 0 0 6px #111',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}>
            {/* Fake status bar */}
            <div style={{
              height: 28,
              background: '#0a0e27',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              fontSize: 11,
              color: 'white',
              fontWeight: '600',
              flexShrink: 0,
            }}>
              <span>12:16</span>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <span style={{ fontSize: 9 }}>5G</span>
                <span>📶</span>
                <span style={{ fontSize: 10 }}>🔋 15%</span>
              </div>
            </div>

            {/* ── Top dark section (starry background + CP + photo) ── */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f4e 50%, #252a6a 100%)',
              flex: '0 0 38%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingTop: 10,
              overflow: 'hidden',
            }}>
              {/* Sparkle stars */}
              {[...Array(12)].map((_, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  width: 2,
                  height: 2,
                  background: 'white',
                  borderRadius: '50%',
                  opacity: 0.4 + Math.random() * 0.5,
                  left: `${8 + Math.random() * 84}%`,
                  top: `${5 + Math.random() * 60}%`,
                  animation: `twinkle ${1.5 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }} />
              ))}

              {/* CP display */}
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 2 }}>
                <span style={{ color: 'white', fontSize: 13, fontWeight: 'bold', letterSpacing: 1 }}>CP</span>
                <span style={{
                  color: 'white', fontSize: 30, fontWeight: 'bold', marginLeft: 3,
                  textShadow: '0 2px 6px rgba(0,0,0,0.5)',
                }}>{pokemonData.cp}</span>
              </div>

              {/* Favorite star */}
              <div style={{
                position: 'absolute', top: 8, right: 14,
                fontSize: 22, color: '#FFD700',
                filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
              }}>★</div>

              {/* Camera icon */}
              <div style={{
                position: 'absolute', top: 36, right: 14,
                width: 28, height: 28, borderRadius: 6,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}>📷</div>

              {/* CP arc indicator */}
              <svg style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)' }}
                width="240" height="120" viewBox="0 0 240 120">
                <path d="M 15 110 A 105 105 0 0 1 225 110" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 15 110 A 105 105 0 0 1 225 110" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={`${(pokemonData.cp / 4100) * 330} 330`} />
                {(() => {
                  const pct = Math.min(pokemonData.cp / 4100, 1);
                  const angle = Math.PI + pct * Math.PI;
                  const cx = 120 + 105 * Math.cos(angle);
                  const cy = 110 + 105 * Math.sin(angle);
                  return <circle cx={cx} cy={cy} r="5" fill="white" filter="url(#glow)" />;
                })()}
                <defs>
                  <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
              </svg>

              {/* Pokemon photo */}
              <div style={{
                position: 'relative',
                width: 140, height: 140,
                marginTop: 4,
                zIndex: 2,
              }}>
                {capturedPhoto ? (
                  <img src={capturedPhoto} alt="Captured" style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    borderRadius: 12,
                    filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.5))',
                  }} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%', borderRadius: 12,
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 56,
                  }}>❓</div>
                )}
              </div>

              {/* Date caught badge */}
              <div style={{
                position: 'absolute', bottom: 6, right: 10,
                background: '#F59E0B', borderRadius: 6,
                padding: '3px 8px',
                display: 'flex', alignItems: 'center', gap: 3, zIndex: 3,
              }}>
                <span style={{ fontSize: 9 }}>🔴</span>
                <div style={{ lineHeight: 1.1 }}>
                  <div style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>{pokemonData.dateCaught.split('/')[0]}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 8 }}>{pokemonData.dateCaught.split('/').slice(1).join('/')}</div>
                </div>
              </div>
            </div>

            {/* ── Bottom white card section ── */}
            <div style={{
              flex: 1,
              background: '#f5f5f5',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              marginTop: -20,
              position: 'relative',
              zIndex: 4,
              padding: '14px 16px 70px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              {/* Name + edit */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <span style={{ fontSize: 21, fontWeight: '400', color: '#222' }}>{pokemonData.name}</span>
                <span style={{ color: '#bbb', fontSize: 14 }}>✏️</span>
                {/* Gender icon */}
                <span style={{ color: '#E91E63', fontSize: 18, marginLeft: 2 }}>♀</span>
              </div>

              {/* HP bar */}
              <div style={{ width: '65%', marginBottom: 1 }}>
                <div style={{ height: 5, background: '#e0e0e0', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, #43CEA2, #56D8A0)', borderRadius: 3 }} />
                </div>
              </div>
              <p style={{ color: '#666', fontSize: 10, marginBottom: 8 }}>{pokemonData.hp} / {pokemonData.hp} HP</p>

              {/* Type tags */}
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 }}>
                {tags.map((tag, i) => (
                  <span key={tag} style={{
                    background: TAG_COLORS[i % TAG_COLORS.length],
                    color: 'white', padding: '3px 12px', borderRadius: 16,
                    fontSize: 11, fontWeight: 'bold',
                  }}>{tag}</span>
                ))}
              </div>

              {/* Weight / Type / Height */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-around',
                width: '100%', marginBottom: 12, padding: '0 4px',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 'bold', color: '#333' }}>{pokemonData.weight}</div>
                  <div style={{ fontSize: 9, color: '#999', textTransform: 'uppercase', marginTop: 1 }}>Weight</div>
                </div>
                <div style={{ width: 1, height: 28, background: '#ddd' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 1 }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: pokemonData.type1Color,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: 'white',
                    }}>💀</span>
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: pokemonData.type2Color,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: 'white',
                    }}>☠️</span>
                  </div>
                  <div style={{ fontSize: 9, color: '#999', textTransform: 'uppercase' }}>
                    {pokemonData.type1} / {pokemonData.type2}
                  </div>
                </div>
                <div style={{ width: 1, height: 28, background: '#ddd' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 'bold', color: '#333' }}>{pokemonData.height}</div>
                  <div style={{ fontSize: 9, color: '#999', textTransform: 'uppercase', marginTop: 1 }}>Height</div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: '90%', height: 1, background: '#e0e0e0', marginBottom: 10 }} />

              {/* Stardust + Candy */}
              <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginBottom: 6 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center' }}>
                    <span style={{ fontSize: 12 }}>✨</span>
                    <span style={{ fontSize: 15, fontWeight: 'bold', color: '#333' }}>{pokemonData.stardust.toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: 8, color: '#999', textTransform: 'uppercase' }}>Stardust</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center' }}>
                    <span style={{ fontSize: 12 }}>🍬</span>
                    <span style={{ fontSize: 15, fontWeight: 'bold', color: '#333' }}>{pokemonData.candy.toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: 8, color: '#999', textTransform: 'uppercase' }}>{pokemonData.name.slice(0, 8)} Candy</div>
                </div>
              </div>

              {/* Candy XL + Mega Energy */}
              <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginBottom: 12 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center' }}>
                    <span style={{ fontSize: 12 }}>🧱</span>
                    <span style={{ fontSize: 15, fontWeight: 'bold', color: '#333' }}>{pokemonData.candyXL}</span>
                  </div>
                  <div style={{ fontSize: 8, color: '#999', textTransform: 'uppercase' }}>Candy XL</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center' }}>
                    <span style={{ fontSize: 12 }}>⚡</span>
                    <span style={{ fontSize: 15, fontWeight: 'bold', color: '#333' }}>{Math.floor(Math.random() * 2000)}</span>
                  </div>
                  <div style={{ fontSize: 8, color: '#999', textTransform: 'uppercase' }}>Mega Energy</div>
                </div>
              </div>

              {/* POWER UP */}
              <button style={{
                width: '88%', padding: '10px 0', borderRadius: 24, border: 'none',
                background: 'linear-gradient(90deg, #F472B6, #EC4899)',
                color: 'white', fontSize: 13, fontWeight: 'bold',
                letterSpacing: 1, textTransform: 'uppercase',
                marginBottom: 8, cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(236,72,153,0.3)',
              }}>
                POWER UP
              </button>

              {/* MEGA EVOLVE */}
              <button style={{
                width: '88%', padding: '10px 0', borderRadius: 24, border: 'none',
                background: 'linear-gradient(90deg, #F87171, #EF4444)',
                color: 'white', fontSize: 13, fontWeight: 'bold',
                letterSpacing: 1, textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(239,68,68,0.3)',
              }}>
                MEGA EVOLVE
              </button>
            </div>

            {/* ── Bottom nav bar ── */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: 56,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32,
              background: 'linear-gradient(180deg, transparent, rgba(245,245,245,0.98) 25%)',
              zIndex: 5,
            }}>
              <button onClick={onDismiss} style={{
                width: 42, height: 42, borderRadius: '50%',
                border: '2.5px solid #2DD4BF', background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, color: '#2DD4BF', cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}>✕</button>
              <button style={{
                width: 42, height: 42, borderRadius: '50%',
                border: '2.5px solid #2DD4BF', background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: '#2DD4BF', cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}>☰</button>
            </div>

            {/* Phone home indicator bar */}
            <div style={{
              position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
              width: 100, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.2)', zIndex: 6,
            }} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes flashFade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
