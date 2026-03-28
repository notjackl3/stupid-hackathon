interface VineLogoProps {
  className?: string;
}

const VINE_LOGO_URL = '/bookmarks/vine-logo.svg';

export function VineLogo({ className = 'h-8 w-[108px]' }: VineLogoProps) {
  return (
    <img
      src={VINE_LOGO_URL}
      alt="Vine"
      className={className}
    />
  );
}
