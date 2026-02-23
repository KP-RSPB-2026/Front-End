import React from 'react';

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded shadow-lg min-w-[320px]">
        <button className="float-right" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="clear-both" />
        {children}
      </div>
    </div>
  );
};

export default Modal;
