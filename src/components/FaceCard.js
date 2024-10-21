import React from 'react';

const FaceCard = ({ name, description, image }) => {
  return (
    <div className="p-4 bg-white rounded-md shadow-md text-center">
      <img src={image} alt={name} className="w-20 h-20 rounded-full mx-auto mb-4" />
      <h3 className="text-lg font-bold text-blue-700">{name}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FaceCard;
