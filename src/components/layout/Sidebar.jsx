import React from 'react';

const Sidebar = ({ items = [] }) => {
  return (
    <aside className="w-64 bg-white border-r p-4">
      <nav className="space-y-2">
        {items.map((item) => (
          <a key={item.label} href={item.href || '#'} className="block rounded px-3 py-2 hover:bg-gray-100">
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
