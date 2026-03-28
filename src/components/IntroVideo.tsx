import { useRef, useEffect } from 'react';

interface IntroVideoProps {
  onDismiss: () => void;
}

export function IntroVideo({ onDismiss }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 8;

    const handleTimeUpdate = () => {
      if (video.currentTime >= 10) {
        onDismiss();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 bg-black z-[10000] cursor-pointer"
      onClick={onDismiss}
    >
      <video
        ref={videoRef}
        src="/YTDown.com_YouTube_doraemon-time-machine_Media_996WRTrzNY_001_1080p.mp4"
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}
