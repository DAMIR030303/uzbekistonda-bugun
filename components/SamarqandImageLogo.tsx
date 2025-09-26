import Image from "next/image";

interface SamarqandImageLogoProps {
  size?: number;
  className?: string;
}

export function SamarqandImageLogo({ size = 64, className = "" }: SamarqandImageLogoProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/images/logos/samarqandda-bugun-logo.png"
        alt="Samarqandda Bugun Logo"
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
