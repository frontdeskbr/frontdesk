
import React from 'react';
import { cn } from '@/lib/utils';

type OTAType = 'booking' | 'airbnb' | 'google' | 'tripadvisor' | 'hoteis' | 'hostelworld' | 'direct';

interface OTAIconProps {
  type: OTAType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  withLabel?: boolean;
}

const otaData = {
  booking: {
    name: 'Booking',
    icon: 'https://framerusercontent.com/images/LufDI55ARulWfIEA3s2avmCTt58.png',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  airbnb: {
    name: 'Airbnb',
    icon: 'https://framerusercontent.com/images/WeNZ2R8hNTOTEWb2p4eOaz9Pk0.png',
    color: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
  },
  google: {
    name: 'Google Ads',
    icon: 'https://framerusercontent.com/images/anqTImRpoTPRVHjXhVpnoNggw.png',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  tripadvisor: {
    name: 'TripAdvisor',
    icon: 'https://framerusercontent.com/images/I3nRevOxGtaehkwOlGB4ChuVc0s.png',
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
  },
  hoteis: {
    name: 'Hoteis.com',
    icon: 'https://framerusercontent.com/images/iOohUDOYIlHQujjO2sWkGz1Y.png',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  },
  hostelworld: {
    name: 'HostelWorld',
    icon: 'https://framerusercontent.com/images/L0chDi2ow8tyJaMbSOQnMViIFzU.png',
    color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
  },
  direct: {
    name: 'Direto',
    icon: '',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
};

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
};

const OTAIcon: React.FC<OTAIconProps> = ({ 
  type, 
  size = 'md', 
  className,
  withLabel = false
}) => {
  const ota = otaData[type];
  
  if (withLabel) {
    return (
      <div className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
        ota.color,
        className
      )}>
        {ota.icon && (
          <img 
            src={ota.icon} 
            alt={ota.name} 
            className={cn(sizeClasses[size], "rounded-full")} 
          />
        )}
        <span>{ota.name}</span>
      </div>
    );
  }
  
  return ota.icon ? (
    <img 
      src={ota.icon} 
      alt={ota.name} 
      className={cn(sizeClasses[size], "rounded-full", className)} 
    />
  ) : (
    <div className={cn(
      "flex items-center justify-center rounded-full",
      sizeClasses[size],
      ota.color,
      className
    )}>
      D
    </div>
  );
};

export { OTAIcon };
export type { OTAType };
