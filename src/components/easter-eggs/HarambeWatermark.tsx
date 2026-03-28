export function HarambeWatermark() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <img
        src="/harambe.png"
        alt=""
        style={{
          width: '800px',
          height: 'auto',
          opacity: 0.04,
          userSelect: 'none',
          transform: 'rotate(-15deg)',
          filter: 'grayscale(100%)',
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: '35%',
        fontSize: '32px',
        opacity: 0.04,
        userSelect: 'none',
        fontFamily: 'Georgia, serif',
        fontStyle: 'italic',
        letterSpacing: '6px',
        textTransform: 'uppercase',
      }}>
        Never Forget
      </div>
    </div>
  );
}
