import React from 'react';
import { twMerge } from 'tailwind-merge';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
  compact = false,
}) => {
  return (
    <div 
      className={twMerge(
        'flex flex-col items-center justify-center text-center',
        compact ? 'p-4' : 'p-8',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className={`font-medium ${compact ? 'text-base' : 'text-lg'}`}>
        {title}
      </h3>
      {description && (
        <p className={`text-muted-foreground ${compact ? 'text-xs mt-1' : 'text-sm mt-2'} max-w-md`}>
          {description}
        </p>
      )}
      {action && (
        <div className={compact ? 'mt-3' : 'mt-4'}>
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState; 