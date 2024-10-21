import React from 'react';

const MedicationItem = ({ name, dose, time, taken, onToggle }) => {
  return (
    <div className={`p-4 bg-white rounded-md shadow-md ${taken ? 'bg-green-100' : ''}`}>
      <h3 className="text-lg font-bold text-blue-700">{name}</h3>
      <p className="text-gray-600">Dose: {dose}</p>
      <p className="text-gray-600">Time: {time}</p>
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={onToggle}
      >
        {taken ? 'Mark as Not Taken' : 'Mark as Taken'}
      </button>
    </div>
  );
};

export default MedicationItem;
