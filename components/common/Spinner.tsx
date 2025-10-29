
import React from 'react';

const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-4',
    };
    return (
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-blue-500 border-t-transparent`}></div>
    );
};

export default Spinner;
