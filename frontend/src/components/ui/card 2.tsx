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

// Additional card components for more flexible usage
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={twMerge('p-6 pb-2', className)}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h3 className={twMerge('text-2xl font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => {
  return (
    <p className={twMerge('text-sm text-muted-foreground mt-1.5', className)}>
      {children}
    </p>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={twMerge('p-6 pt-0', className)}>
      {children}
    </div>
  );
};

export default Card;
export { CardHeader, CardTitle, CardDescription, CardContent };
