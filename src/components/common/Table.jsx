import React from 'react';

const Table = ({ head, children }) => {
  return (
    <table className="min-w-full border-collapse">
      {head && <thead>{head}</thead>}
      <tbody>{children}</tbody>
    </table>
  );
};

export default Table;
