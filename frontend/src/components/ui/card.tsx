import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  footer?: React.ReactNode;
  fullHeight?: boolean;
  compact?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  footer,
  fullHeight = false,
  compact = false,
}) => {
  return (
    <div 
      className={twMerge(
        'bg-card text-card-foreground rounded-lg border shadow-sm',
        fullHeight ? 'h-full' : '',
        compact ? 'p-3' : 'p-5',
        className
      )}
    >
      {title && (
        <div className="mb-3 font-medium text-lg">{title}</div>
      )}
      <div className={compact ? '' : 'py-2'}>
        {children}
      </div>
      {footer && (
        <div className="border-t pt-3 mt-3 text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
