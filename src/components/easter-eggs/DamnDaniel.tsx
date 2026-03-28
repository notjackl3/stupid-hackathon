import { useState, useEffect } from 'react';

interface DamnDanielProps {
  message: string;
  onDismiss: () => void;
}

const DAMN_DANIEL_TEMPLATES = [
  (msg: string) => `Damn Daniel, back at it again with the ${msg}!`,
  (msg: string) => `DAMN, Daniel! ${msg}! 🔥`,
  (msg: string) => `Daaaamn Daniel! Back at it again — ${msg}!`,
  (msg: string) => `Yo DAMN Daniel!! ${msg}!! White Vans!! 👟`,
];

export function makeDamnDaniel(message: string): string {
  const template = DAMN_DANIEL_TEMPLATES[Math.floor(Math.random() * DAMN_DANIEL_TEMPLATES.length)];
  return template(message);
}

export function DamnDaniel({ message, onDismiss }: DamnDanielProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const danielMessage = makeDamnDaniel(message);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDismiss, 400);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      maxWidth: '350px',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      color: 'white',
      borderRadius: '8px',
      padding: '12px 16px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      border: '2px solid #e94560',
      transform: visible && !exiting ? 'translateX(0)' : 'translateX(120%)',
      transition: 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      {/* White Vans emoji */}
      <span style={{ fontSize: '28px', flexShrink: 0 }}>👟</span>
      <div>
        <div style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: '#e94560',
          fontWeight: 'bold',
          marginBottom: '4px',
        }}>
          System Notification
        </div>
        <p style={{
          margin: 0,
          fontSize: '13px',
          lineHeight: 1.4,
        }}>
          {danielMessage}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setExiting(true);
          setTimeout(onDismiss, 400);
        }}
        style={{
          position: 'absolute',
          top: '4px',
          right: '8px',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.5)',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        ✕
      </button>
    </div>
  );
}
