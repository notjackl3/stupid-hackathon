import { useEffect, useRef } from 'react';

interface ChatGPTSikeProps {
  onDismiss: () => void;
}

export function ChatGPTSike({ onDismiss }: ChatGPTSikeProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/oh-brother-this-guy-stinks.mp3');
    audioRef.current = audio;
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black cursor-pointer"
      onClick={onDismiss}
    >
      <img
        src="/sike.jpg"
        alt="Sike!"
        className="max-w-full max-h-full object-contain"
      />
      <div className="absolute bottom-8 text-white text-xl font-bold animate-pulse">
        Click anywhere to continue
      </div>
    </div>
  );
}
