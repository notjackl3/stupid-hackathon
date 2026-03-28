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
        src="/harambe.jpg"
        alt=""
        style={{
          width: '500px',
          height: 'auto',
          opacity: 0.03,
          userSelect: 'none',
          transform: 'rotate(-15deg)',
          filter: 'grayscale(100%)',
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: '40%',
        fontSize: '24px',
        opacity: 0.03,
        userSelect: 'none',
        fontFamily: 'Georgia, serif',
        fontStyle: 'italic',
        letterSpacing: '4px',
        textTransform: 'uppercase',
      }}>
        Never Forget
      </div>
    </div>
  );
}
