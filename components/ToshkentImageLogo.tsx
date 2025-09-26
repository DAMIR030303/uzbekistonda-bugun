import Image from "next/image";

interface ToshkentImageLogoProps {
  size?: number;
  className?: string;
}

export function ToshkentImageLogo({ size = 64, className = "" }: ToshkentImageLogoProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/images/logos/toshkentda-bugun-logo.jpg"
        alt="Toshkentda Bugun Logo"
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
