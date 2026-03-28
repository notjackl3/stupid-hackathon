import { useState } from 'react';

interface HarambeConfirmProps {
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const GUILT_MESSAGES = [
  'Harambe died for this. Are you sure?',
  'Every time you close something, Harambe sheds a tear. Continue?',
  'Harambe gave his life so you could browse. You really wanna do this?',
  'This action is dedicated to Harambe. Proceed?',
  'Harambe is watching. Are you absolutely sure?',
  'Closing this dishonors Harambe\'s memory. Still want to?',
  'Harambe didn\'t die for you to close this. Are you sure?',
  'In memory of Harambe (1999-2016). Do you still want to continue?',
];

export function HarambeConfirm({ message, onConfirm, onCancel }: HarambeConfirmProps) {
  const [msg] = useState(() => message || GUILT_MESSAGES[Math.floor(Math.random() * GUILT_MESSAGES.length)]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{
        background: '#f0f0f0',
        border: '2px solid #888',
        borderRadius: 4,
        boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
        width: 420,
        maxWidth: '90vw',
        overflow: 'hidden',
      }}>
        {/* Title bar */}
        <div style={{
          background: 'linear-gradient(180deg, #0058e6 0%, #3a7ff5 50%, #0058e6 100%)',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
            Internet Explorer
          </span>
          <button
            onClick={onCancel}
            style={{
              background: '#c75050',
              border: '1px solid #933',
              color: 'white',
              fontSize: 11,
              width: 18,
              height: 18,
              lineHeight: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: 2,
              padding: 0,
            }}
          >✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {/* Harambe image instead of warning icon */}
          <img
            src="/harambe.png"
            alt="Harambe"
            style={{
              width: 64,
              height: 64,
              objectFit: 'cover',
              borderRadius: '50%',
              border: '2px solid #666',
              flexShrink: 0,
            }}
          />
          <div>
            <p style={{ fontSize: 13, color: '#222', margin: '0 0 6px', lineHeight: 1.5 }}>
              {msg}
            </p>
            <p style={{ fontSize: 11, color: '#888', margin: 0, fontStyle: 'italic' }}>
              🕯️ RIP Harambe (1999 - 2016)
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div style={{
          padding: '8px 24px 16px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
        }}>
          <button
            onClick={onConfirm}
            style={{
              background: 'linear-gradient(180deg, #f5f5f5, #ddd)',
              border: '1px solid #888',
              borderRadius: 3,
              padding: '5px 20px',
              fontSize: 12,
              cursor: 'pointer',
              color: '#222',
            }}
          >
            Yes, I'm sorry Harambe
          </button>
          <button
            onClick={onCancel}
            style={{
              background: 'linear-gradient(180deg, #f5f5f5, #ddd)',
              border: '1px solid #888',
              borderRadius: 3,
              padding: '5px 20px',
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#222',
            }}
          >
            No, for Harambe
          </button>
        </div>
      </div>
    </div>
  );
}
