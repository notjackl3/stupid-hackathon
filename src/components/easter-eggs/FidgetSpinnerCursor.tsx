import { useEffect, useState, useRef } from 'react';

export function FidgetSpinnerCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const animRef = useRef<number>(0);
  const spinnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      // Each click adds a burst of spin force
      velocityRef.current += 15 + Math.random() * 10;
      velocityRef.current = Math.min(velocityRef.current, 80);
    };

    const animate = () => {
      velocityRef.current *= 0.985; // Gradual friction
      if (Math.abs(velocityRef.current) < 0.05) {
        velocityRef.current = 0;
      }
      rotationRef.current += velocityRef.current;
      if (spinnerRef.current) {
        spinnerRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleClick);
    animRef.current = requestAnimationFrame(animate);

    // Hide default cursor
    document.body.style.cursor = 'none';
    // Also hide cursor on all elements
    const style = document.createElement('style');
    style.id = 'fidget-spinner-cursor-style';
    style.textContent = '* { cursor: none !important; }';
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleClick);
      cancelAnimationFrame(animRef.current);
      document.body.style.cursor = '';
      const el = document.getElementById('fidget-spinner-cursor-style');
      if (el) el.remove();
    };
  }, []);

  return (
    <div
      ref={spinnerRef}
      style={{
        position: 'fixed',
        left: position.x - 16,
        top: position.y - 16,
        width: '32px',
        height: '32px',
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32">
        {/* Center bearing */}
        <circle cx="16" cy="16" r="4" fill="#666" stroke="#444" strokeWidth="1" />
        <circle cx="16" cy="16" r="2" fill="#999" />
        {/* Three arms */}
        {[0, 120, 240].map(angle => {
          const rad = (angle * Math.PI) / 180;
          const x = 16 + Math.cos(rad) * 10;
          const y = 16 + Math.sin(rad) * 10;
          return (
            <g key={angle}>
              <line
                x1="16" y1="16" x2={x} y2={y}
                stroke="#555" strokeWidth="4" strokeLinecap="round"
              />
              <circle cx={x} cy={y} r="3.5" fill="#4285F4" stroke="#3367D6" strokeWidth="0.5" />
              <circle cx={x} cy={y} r="1.5" fill="#5a9eff" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
