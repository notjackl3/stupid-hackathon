import { useState } from 'react';
import { playSound } from '../../lib/soundSynth';
import type { SoundButton as SoundButtonData } from '../../data/myinstantsSounds';

interface SoundButtonProps {
  sound: SoundButtonData;
}

export function SoundButton({ sound }: SoundButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleClick = () => {
    playSound(sound.soundFile);
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <div className="flex flex-col items-center" style={{ width: 118 }}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Play ${sound.name}`}
        className="w-[82px] h-[82px] rounded-full cursor-pointer border-none outline-none relative select-none"
        style={{
          background: `radial-gradient(circle at 34% 25%, color-mix(in srgb, ${sound.color} 48%, white) 0%, color-mix(in srgb, ${sound.color} 18%, white) 22%, ${sound.color} 48%, color-mix(in srgb, ${sound.color} 34%, black) 76%, color-mix(in srgb, ${sound.color} 58%, black) 100%)`,
          border: `1px solid color-mix(in srgb, ${sound.color} 52%, black)`,
          boxShadow: isPressed
            ? `0 1px 0 color-mix(in srgb, ${sound.color} 48%, black), 0 3px 6px rgba(0,0,0,0.2), inset 0 -3px 5px rgba(0,0,0,0.28), inset 0 3px 4px rgba(255,255,255,0.2)`
            : `0 3px 0 color-mix(in srgb, ${sound.color} 48%, black), 0 7px 10px rgba(0,0,0,0.24), inset 0 -6px 8px rgba(0,0,0,0.28), inset 0 3px 4px rgba(255,255,255,0.16)`,
          transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
          transition: 'transform 0.08s ease, box-shadow 0.08s ease',
        }}
      >
        <div
          className="absolute top-[10px] left-[13px] w-[34px] h-[22px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.56) 0%, rgba(255,255,255,0.12) 58%, rgba(255,255,255,0) 100%)',
          }}
        />
        <div
          className="absolute inset-x-[10px] bottom-[10px] h-[12px] rounded-full pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.2))' }}
        />
      </button>

      <button
        type="button"
        onClick={handleClick}
        className="mt-2 min-h-[24px] max-w-[108px] cursor-pointer text-center text-[11px] leading-[1.1] tracking-[-0.01em] text-[#4a4a4a] hover:text-[#c64545] hover:underline"
        style={{ textTransform: 'uppercase' }}
      >
        {sound.name}
      </button>

      <div className="flex items-center gap-2 mt-1">
        <button
          type="button"
          onClick={() => setLiked(!liked)}
          aria-label={liked ? `Remove ${sound.name} from favorites` : `Add ${sound.name} to favorites`}
          className="w-[14px] h-[14px] flex items-center justify-center cursor-pointer border-none bg-transparent p-0"
          title={liked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? '#f06b6b' : 'none'} stroke={liked ? '#f06b6b' : '#cfcfcf'} strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <button
          type="button"
          aria-label={`Copy link for ${sound.name}`}
          className="w-[14px] h-[14px] flex items-center justify-center cursor-pointer border-none bg-transparent p-0"
          title="Copy link"
          onClick={() => navigator.clipboard.writeText(`https://www.myinstants.com/instant/${sound.id}/`)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cfcfcf" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
      </div>
    </div>
  );
}
