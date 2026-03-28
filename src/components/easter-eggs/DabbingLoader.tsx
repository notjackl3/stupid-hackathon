interface DabbingLoaderProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

export function DabbingLoader({ text = 'Loading...', size = 'medium' }: DabbingLoaderProps) {
  const scale = size === 'small' ? 0.6 : size === 'large' ? 1.4 : 1;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      padding: '20px',
    }}>
      <div style={{
        transform: `scale(${scale})`,
        animation: 'dabRepeat 1s ease-in-out infinite',
        fontSize: '48px',
        lineHeight: 1,
      }}>
        {/* Stick figure dabbing using CSS */}
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ overflow: 'visible' }}>
          {/* Head */}
          <circle cx="40" cy="12" r="8" fill="#333" />
          {/* Body */}
          <line x1="40" y1="20" x2="40" y2="50" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          {/* Left arm (up in dab) */}
          <line x1="40" y1="28" x2="15" y2="10" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          {/* Right arm (across face) */}
          <line x1="40" y1="28" x2="55" y2="15" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          <line x1="55" y1="15" x2="45" y2="8" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          {/* Left leg */}
          <line x1="40" y1="50" x2="28" y2="72" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          {/* Right leg */}
          <line x1="40" y1="50" x2="52" y2="72" stroke="#333" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <p style={{
        color: '#666',
        fontSize: size === 'small' ? '11px' : '13px',
        fontFamily: 'Arial, sans-serif',
      }}>
        {text}
      </p>
      <style>{`
        @keyframes dabRepeat {
          0%, 100% { transform: scale(${scale}) rotate(0deg); }
          25% { transform: scale(${scale}) rotate(-15deg); }
          50% { transform: scale(${scale}) rotate(0deg); }
          75% { transform: scale(${scale}) rotate(15deg); }
        }
      `}</style>
    </div>
  );
}
