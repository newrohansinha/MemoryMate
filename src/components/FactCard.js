import React from 'react';

const FactCard = ({ category, fact }) => {
  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h3 className="text-lg font-bold text-blue-700">{category}</h3>
      <p className="text-gray-600">{fact}</p>
    </div>
  );
};

export default FactCard;
