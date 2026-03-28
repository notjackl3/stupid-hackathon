import { useEffect, useState, useRef } from 'react';
import { Howl } from 'howler';

interface LoganPaulProps {
  onDismiss: () => void;
}

export function LoganPaul({ onDismiss }: LoganPaulProps) {
  const [opacity, setOpacity] = useState(0);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    const sound = new Howl({
      src: ['/fahh.mp3'],
      volume: 1.0,
      sprite: { clip: [500, 5000] },
    });
    soundRef.current = sound;
    sound.play('clip');

    const fadeIn = setTimeout(() => setOpacity(1), 50);
    const dismiss = setTimeout(() => onDismiss(), 4000);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(dismiss);
      sound.stop();
    };
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center cursor-pointer"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${opacity * 0.95})`,
        transition: 'background-color 0.3s ease',
      }}
      onClick={onDismiss}
    >
      <img
        src="/logan.jpg"
        alt=""
        className="w-full h-full object-cover"
        style={{ opacity, transition: 'opacity 0.3s ease' }}
      />
    </div>
  );
}
