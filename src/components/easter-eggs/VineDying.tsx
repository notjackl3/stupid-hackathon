import { useState, useEffect, useRef } from 'react';

interface VineDyingProps {
  /** Original video/content to wrap */
  children: React.ReactNode;
  /** Whether the vine limit is active */
  active?: boolean;
}

export function VineDying({ children, active = true }: VineDyingProps) {
  const [timeLeft, setTimeLeft] = useState(6);
  const [showRIP, setShowRIP] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!active) return;

    startRef.current = Date.now();
    setTimeLeft(6);
    setShowRIP(false);

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const remaining = Math.max(0, 6 - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setShowRIP(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active]);

  if (!active) return <>{children}</>;

  return (
    <div style={{ position: 'relative' }}>
      {/* Vine timer bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 5,
        background: 'rgba(0,0,0,0.2)',
      }}>
        <div style={{
          height: '100%',
          width: `${(timeLeft / 6) * 100}%`,
          background: timeLeft > 2 ? '#00b488' : '#f44336',
          transition: 'width 0.1s linear, background 0.3s',
        }} />
      </div>

      {/* Timer badge */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        zIndex: 5,
        background: 'rgba(0,0,0,0.7)',
        color: timeLeft > 2 ? '#00b488' : '#f44336',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
      }}>
        {timeLeft.toFixed(1)}s 🌿
      </div>

      {/* Content */}
      <div style={{
        opacity: showRIP ? 0.3 : 1,
        transition: 'opacity 0.5s',
        pointerEvents: showRIP ? 'none' : 'auto',
      }}>
        {children}
      </div>

      {/* RIP Vine overlay */}
      {showRIP && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 6,
          animation: 'vineFadeIn 0.5s ease-out',
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '8px',
          }}>🌿</div>
          <p style={{
            color: '#333',
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'Georgia, serif',
          }}>
            RIP Vine
          </p>
          <p style={{
            color: '#666',
            fontSize: '12px',
            fontStyle: 'italic',
          }}>
            2013 — 2016
          </p>
          <p style={{
            color: '#999',
            fontSize: '11px',
            marginTop: '8px',
          }}>
            This content was limited to 6 seconds
          </p>
          <button
            onClick={() => {
              startRef.current = Date.now();
              setTimeLeft(6);
              setShowRIP(false);
              timerRef.current = setInterval(() => {
                const elapsed = (Date.now() - startRef.current) / 1000;
                const remaining = Math.max(0, 6 - elapsed);
                setTimeLeft(remaining);
                if (remaining <= 0) {
                  setShowRIP(true);
                  if (timerRef.current) clearInterval(timerRef.current);
                }
              }, 100);
            }}
            style={{
              marginTop: '12px',
              padding: '6px 20px',
              background: '#00b488',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            🔄 Loop (it's what Vine would've wanted)
          </button>
          <style>{`
            @keyframes vineFadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
