import React from 'react';

interface StaggerItemProps {
  children: React.ReactNode;
  index: number;
  baseDelay?: number;
  maxDelay?: number;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  index,
  baseDelay = 60,
  maxDelay = 360,
  className = ''
}) => {
  const delay = Math.min(index * baseDelay, maxDelay);

  return (
    <div
      className={`animate-card-pop ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
