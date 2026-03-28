import { useState, useEffect } from 'react';

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const CORNERS: Record<Corner, { top?: string; bottom?: string; left?: string; right?: string }> = {
  'top-left': { top: '5px', left: '5px' },
  'top-right': { top: '5px', right: '5px' },
  'bottom-left': { bottom: '5px', left: '5px' },
  'bottom-right': { bottom: '5px', right: '5px' },
};

const CORNER_KEYS = Object.keys(CORNERS) as Corner[];

export function CreepyClown() {
  const [corner, setCorner] = useState<Corner>(() =>
    CORNER_KEYS[Math.floor(Math.random() * CORNER_KEYS.length)]
  );

  // Relocate to a different corner every 15-40 seconds
  useEffect(() => {
    const relocate = () => {
      const delay = 15000 + Math.random() * 25000;
      return setTimeout(() => {
        setCorner(prev => {
          const others = CORNER_KEYS.filter(c => c !== prev);
          return others[Math.floor(Math.random() * others.length)];
        });
        timerRef = relocate();
      }, delay);
    };

    let timerRef = relocate();
    return () => clearTimeout(timerRef);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        ...CORNERS[corner],
        zIndex: 9997,
        fontSize: '32px',
        pointerEvents: 'none',
        opacity: 0.15,
        userSelect: 'none',
        transition: 'opacity 2s ease-in-out',
        filter: 'drop-shadow(0 0 2px rgba(255,0,0,0.2))',
      }}
    >
      <img src="/clown.png" alt="" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
    </div>
  );
}
