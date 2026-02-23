import React from 'react';

const PrescriptionForm = () => {
  return (
    <form className="space-y-3">
      <input className="w-full border rounded px-3 py-2" placeholder="Patient name" />
      <input className="w-full border rounded px-3 py-2" placeholder="Medicine" />
      <textarea className="w-full border rounded px-3 py-2" rows="4" placeholder="Notes" />
      <button className="rounded bg-blue-600 px-4 py-2 text-white">Save</button>
    </form>
  );
};

export default PrescriptionForm;
