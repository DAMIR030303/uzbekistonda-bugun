import Image from "next/image";

interface NavoiyImageLogoProps {
  size?: number;
  className?: string;
}

export function NavoiyImageLogo({ size = 64, className = "" }: NavoiyImageLogoProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/images/logos/navoiyda-bugun-logo.jpg"
        alt="Navoiyda Bugun Logo"
        width={size}
        height={size}
        className="object-contain rounded-full"
        style={{ 
          backgroundColor: 'transparent',
          mixBlendMode: 'multiply'
        }}
        priority
      />
    </div>
  );
}
