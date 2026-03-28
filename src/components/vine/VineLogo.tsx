interface VineLogoProps {
  className?: string;
}

const VINE_LOGO_URL = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-world.net%2Fwp-content%2Fuploads%2F2021%2F02%2FVine-Logo-2013-2017.png&f=1&nofb=1&ipt=cb4db12843b40df4e02ce08c354adc471a3a12f493392573e0a33d167099c626';

export function VineLogo({ className = 'h-8 w-[108px]' }: VineLogoProps) {
  return (
    <img
      src={VINE_LOGO_URL}
      alt="Vine"
      className={className}
    />
  );
}
