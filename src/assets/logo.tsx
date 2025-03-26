
import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  logoOnly?: boolean;
}

export const FrontdeskLogo: React.FC<LogoProps> = ({ 
  className = "", 
  size = 40 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M32 0C14.4 0 0 14.4 0 32s14.4 32 32 32 32-14.4 32-32S49.6 0 32 0z" 
        fill="#0080FF" 
      />
      <path 
        d="M16 22h32v20H16V22z" 
        fill="#FFFFFF" 
      />
      <path 
        d="M22 28h20v8H22v-8z" 
        fill="#0080FF" 
      />
    </svg>
  );
};

export const TextLogo: React.FC<LogoProps> = ({ 
  className = "", 
  size = 40,
  logoOnly = false
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <FrontdeskLogo size={size} />
      {!logoOnly && <span className="ml-2 font-semibold text-xl">Frontdesk</span>}
    </div>
  );
};
