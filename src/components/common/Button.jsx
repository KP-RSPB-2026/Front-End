import React from 'react';

const Button = ({ children, variant = 'primary', ...props }) => {
  const base = 'px-4 py-2 rounded';
  const tone = variant === 'ghost' ? 'bg-transparent border' : 'bg-blue-600 text-white';
  return (
    <button className={`${base} ${tone}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
