
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className, title }) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 ${className}`}>
      {title && <h2 className="text-lg font-bold mb-4 text-gray-200">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
