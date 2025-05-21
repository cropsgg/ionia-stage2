import React from 'react';
import { twMerge } from 'tailwind-merge';

interface StatBlockProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
}

const StatBlock: React.FC<StatBlockProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  className,
  valueClassName,
}) => {
  return (
    <div className={twMerge('flex items-start', className)}>
      {icon && (
        <div className="mr-3 p-2.5 bg-primary/10 rounded-full text-primary">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className={twMerge("text-2xl font-semibold mt-1", valueClassName)}>
          {value}
          {unit && <span className="text-base text-muted-foreground font-normal ml-1">{unit}</span>}
        </p>
        {trend && (
          <p className={`text-xs mt-1 flex items-center ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend.isPositive ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V7z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 13a1 1 0 10-2 0v-5.586l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L12 7.414V13z" clipRule="evenodd" />
              </svg>
            )}
            {trend.value}% from last period
          </p>
        )}
      </div>
    </div>
  );
};

export default StatBlock; 