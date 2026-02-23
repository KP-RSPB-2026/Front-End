import React from 'react';

const Select = ({ children, ...props }) => {
  return (
    <select className="border rounded px-3 py-2 w-full" {...props}>
      {children}
    </select>
  );
};

export default Select;
