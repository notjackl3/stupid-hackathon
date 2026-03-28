import { useState, useEffect } from 'react';

interface MannequinChallengeProps {
  onDismiss: () => void;
  durationSeconds?: number;
  trackLabel?: string;
}

export function MannequinChallenge({
  onDismiss,
  durationSeconds = 15,
  trackLabel = 'Black Beatles',
}: MannequinChallengeProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    const titleTimer = setTimeout(() => setShowTitle(false), 2000);
    return () => clearTimeout(titleTimer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onDismiss]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10002,
        background: 'rgba(0,0,0,0.15)',
        cursor: 'not-allowed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'grayscale(80%)',
        WebkitBackdropFilter: 'grayscale(80%)',
      }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {/* Title card */}
      {showTitle && (
        <div style={{
          background: 'black',
          color: 'white',
          padding: '24px 48px',
          fontSize: '32px',
          fontWeight: 'bold',
          fontFamily: 'Georgia, serif',
          textTransform: 'uppercase',
          letterSpacing: '6px',
          animation: 'fadeInChallenge 0.5s ease-out',
        }}>
          MANNEQUIN CHALLENGE
        </div>
      )}

      {/* Timer */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '4px',
        fontSize: '14px',
        fontFamily: 'monospace',
      }}>
        🎵 {trackLabel} — {secondsLeft}s
      </div>

      {/* Fake camera recording indicator */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#f44336',
          animation: 'blink 1s ease-in-out infinite',
        }} />
        <span style={{
          color: 'white',
          fontSize: '13px',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        }}>
          REC
        </span>
      </div>

      <style>{`
        @keyframes fadeInChallenge {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
