import React from 'react';

interface PopInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  id?: string;
}

export const PopIn: React.FC<PopInProps> = ({ children, delay = 0, className = '', id }) => {
  return (
    <div
      id={id}
      className={`animate-card-pop ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
