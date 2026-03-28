import { useState, useEffect, useCallback } from 'react';

type Edge = 'top' | 'bottom' | 'left' | 'right';

const EDGES: Edge[] = ['top', 'bottom', 'left', 'right'];

function randomEdge(exclude?: Edge): Edge {
  const options = exclude ? EDGES.filter((e) => e !== exclude) : EDGES;
  return options[Math.floor(Math.random() * options.length)];
}

function randomOffset(): number {
  // Random position along the edge (10%-90%)
  return 10 + Math.random() * 80;
}

function getStyle(edge: Edge, offset: number, visible: boolean) {
  const size = 100;
  const peekAmount = visible ? 55 : 0; // how many px visible (slightly more than half)
  const hidden = -size; // fully off screen

  const base: React.CSSProperties = {
    position: 'fixed',
    width: size,
    height: size,
    zIndex: 9997,
    pointerEvents: 'auto',
    cursor: 'default',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'visible',
  };

  const img: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
  };

  switch (edge) {
    case 'bottom':
      return {
        container: {
          ...base,
          bottom: visible ? -(size - peekAmount) : hidden,
          left: `${offset}%`,
          transform: 'translateX(-50%)',
        },
        img: { ...img },
      };
    case 'top':
      return {
        container: {
          ...base,
          top: visible ? -(size - peekAmount) : hidden,
          left: `${offset}%`,
          transform: 'translateX(-50%) rotate(180deg)',
        },
        img: { ...img },
      };
    case 'left':
      return {
        container: {
          ...base,
          left: visible ? -(size - peekAmount) : hidden,
          top: `${offset}%`,
          transform: 'translateY(-50%) rotate(90deg)',
        },
        img: { ...img },
      };
    case 'right':
      return {
        container: {
          ...base,
          right: visible ? -(size - peekAmount) : hidden,
          top: `${offset}%`,
          transform: 'translateY(-50%) rotate(-90deg)',
        },
        img: { ...img },
      };
  }
}

interface CreepyClownProps {
  interval?: number;
}

export function CreepyClown({ interval = 20000 }: CreepyClownProps) {
  const [edge, setEdge] = useState<Edge>(randomEdge);
  const [offset, setOffset] = useState(randomOffset);
  const [visible, setVisible] = useState(false);

  const relocate = useCallback((currentEdge?: Edge, instant = false) => {
    setVisible(false);
    if (instant) {
      // Immediately jump to new spot, no transition
      const newEdge = randomEdge(currentEdge);
      // Use requestAnimationFrame to batch the state updates after hide
      requestAnimationFrame(() => {
        setEdge(newEdge);
        setOffset(randomOffset());
        // Peek back in after a short pause
        setTimeout(() => setVisible(true), 200 + Math.random() * 500);
      });
    } else {
      setTimeout(() => {
        const newEdge = randomEdge(currentEdge);
        setEdge(newEdge);
        setOffset(randomOffset());
        setTimeout(() => setVisible(true), 300 + Math.random() * 700);
      }, 600);
    }
  }, []);

  // Initial appearance
  useEffect(() => {
    const initialDelay = setTimeout(() => setVisible(true), 2000 + Math.random() * 3000);
    return () => clearTimeout(initialDelay);
  }, []);

  // Periodic relocation
  useEffect(() => {
    const timer = setInterval(() => {
      relocate(edge);
    }, interval + Math.random() * 10000);
    return () => clearInterval(timer);
  }, [edge, interval, relocate]);

  const handleMouseEnter = () => {
    relocate(edge, true);
  };

  const styles = getStyle(edge, offset, visible);

  return (
    <div style={styles.container} onMouseEnter={handleMouseEnter}>
      <img src="/clown.png" alt="" style={{ ...styles.img, opacity: visible ? 0.85 : 0 }} />
    </div>
  );
}
