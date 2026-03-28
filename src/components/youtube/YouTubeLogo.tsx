interface YouTubeLogoProps {
  variant?: 'default' | 'white';
  className?: string;
}

export function YouTubeLogo({ variant = 'default', className = '' }: YouTubeLogoProps) {
  const src = variant === 'white' ? '/assets/youtube-logo-white.png' : '/assets/youtube-logo.png';

  return (
    <img
      src={src}
      alt="YouTube"
      className={`block h-6 w-auto select-none ${className}`.trim()}
      draggable={false}
    />
  );
}
