import { useEffect, useState } from 'react';

interface HarambeMemorialProps {
  onDismiss: () => void;
}

export function HarambeMemorial({ onDismiss }: HarambeMemorialProps) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in
    const fadeIn = setTimeout(() => setOpacity(1), 100);
    // Auto dismiss after 8 seconds
    const dismiss = setTimeout(() => onDismiss(), 8000);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(dismiss);
    };
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center cursor-pointer"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${opacity * 0.85})`,
        transition: 'background-color 1s ease',
      }}
      onClick={onDismiss}
    >
      <div
        className="text-center"
        style={{ opacity, transition: 'opacity 1.5s ease' }}
      >
        <div className="text-8xl mb-6">&#129421;</div>
        <div className="text-white text-3xl font-light tracking-wider mb-4">
          In Memoriam
        </div>
        <div className="text-white text-5xl font-bold mb-3">
          Harambe
        </div>
        <div className="text-gray-300 text-xl mb-6">
          1999 &mdash; 2016
        </div>
        <div className="text-gray-400 text-base italic">
          "We never got our dicks out fast enough"
        </div>
        <div className="text-gray-500 text-sm mt-8">
          &#9829; Never Forget &#9829;
        </div>
        <div className="text-gray-600 text-xs mt-4">
          Click anywhere to continue
        </div>
      </div>
    </div>
  );
}
