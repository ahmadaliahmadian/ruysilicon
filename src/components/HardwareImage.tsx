import { useState } from 'react';
import { Cpu } from 'lucide-react';

interface HardwareImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

export function HardwareImage({ src, alt, title, className = '' }: HardwareImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-[#EFEFEA] to-[#E2E2DC] flex flex-col items-center justify-center p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Cpu className="w-10 h-10 text-neutral-400 mb-3" />
        {title && <span className="text-xs font-medium text-neutral-600 line-clamp-2">{title}</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
