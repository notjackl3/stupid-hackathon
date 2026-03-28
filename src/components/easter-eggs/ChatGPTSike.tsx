import { useEffect, useRef, useState } from 'react';

interface ChatGPTSikeProps {
  onDismiss: () => void;
}

const POINTING_IMAGES = [
  '/pointing1.jpg',
  '/pointing2.jpg',
  '/pointing3.webp',
  '/pointing4.jpg',
  '/pointing5.jpg',
  '/pointing6.jpg',
  '/pointing7.jpg',
  '/pointing8.webp',
  '/pointing9.png',
  '/pointing10.jpg',
  '/pointing11.webp',
  '/pointing12.jpg',
  '/pointing13.jpg',
  '/pointing14.webp',
  '/pointing15.gif',
  '/pointing16.gif',
  '/pointing17.webp',
  '/pointing18.jpeg',
  '/pointing19.jpg',
  '/pointing20.jpeg',
];

// Pre-generate random positions for each image so they don't shift on re-render
const IMAGE_POSITIONS = POINTING_IMAGES.map(() => ({
  top: Math.random() * 70,
  left: Math.random() * 70,
  rotation: Math.random() * 30 - 15,
  size: 280 + Math.floor(Math.random() * 180),
}));

export function ChatGPTSike({ onDismiss }: ChatGPTSikeProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    const audio = new Audio('/oh-brother-this-guy-stinks.mp3');
    audioRef.current = audio;
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Pop in images one by one
  useEffect(() => {
    if (visibleCount >= POINTING_IMAGES.length) {
      // After all small ones, show the big center one
      const mainTimer = setTimeout(() => setShowMain(true), 300);
      return () => clearTimeout(mainTimer);
    }
    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, 150);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <div
      className="fixed inset-0 z-[300] bg-black cursor-pointer overflow-hidden"
      onClick={onDismiss}
    >
      {/* Sike background */}
      <img
        src="/sike.jpg"
        alt="Sike!"
        className="absolute inset-0 w-full h-full object-contain opacity-30"
      />

      {/* Pointing images popping in one by one */}
      {POINTING_IMAGES.map((src, i) => {
        if (i >= visibleCount) return null;
        const pos = IMAGE_POSITIONS[i];
        return (
          <img
            key={src}
            src={src}
            alt=""
            style={{
              position: 'absolute',
              top: `${pos.top}%`,
              left: `${pos.left}%`,
              width: pos.size,
              height: pos.size,
              objectFit: 'cover',
              transform: `rotate(${pos.rotation}deg)`,
              animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              zIndex: 301 + i,
            }}
          />
        );
      })}

      {/* pointing21.jpg — big center image, appears last */}
      {showMain && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 350 }}
        >
          <img
            src="/pointing21.jpg"
            alt=""
            style={{
              width: '60vw',
              height: '60vh',
              objectFit: 'cover',
              animation: 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        </div>
      )}

      <div className="absolute bottom-8 left-0 right-0 text-center text-white text-xl font-bold animate-pulse" style={{ zIndex: 400 }}>
        Click anywhere to continue
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
