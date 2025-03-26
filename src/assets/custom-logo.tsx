
import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const CustomLogo: React.FC<LogoProps> = ({ className, size = 42 }) => (
  <img
    src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://frontdesk.com.br/&size=64"
    alt="Frontdesk Logo"
    width={size}
    height={size}
    className={className}
  />
);

export const TextLogo: React.FC<LogoProps & { hideText?: boolean }> = ({ 
  className, 
  size = 32,
  hideText = false
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <CustomLogo size={size} />
    {!hideText && <span className="font-semibold text-xl">Frontdesk</span>}
  </div>
);
