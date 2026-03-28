interface VineLogoProps {
  color?: string;
  className?: string;
}

export function VineLogo({ color = '#00bf8f', className = 'h-8 w-[108px]' }: VineLogoProps) {
  return (
    <svg viewBox="0 0 130 44" className={className} aria-label="Vine logo" role="img">
      <text
        x="8"
        y="31"
        fill={color}
        fontSize="30"
        fontWeight="700"
        fontFamily="'Brush Script MT','Segoe Script','Snell Roundhand',cursive"
      >
        Vine
      </text>
    </svg>
  );
}
