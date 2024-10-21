import React from 'react';

const EmergencyContactPage = () => {
  const emergencyContact = {
    name: 'John Doe',
    phone: '(123) 456-7890',
    email: 'johndoe@example.com'
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Emergency Contact</h2>
      <p className="text-gray-600 mb-6">In case of an emergency, contact the person below.</p>

      <div className="p-4 bg-white rounded-md shadow-md">
        <h3 className="text-xl font-bold">{emergencyContact.name}</h3>
        <p className="text-gray-600">Phone: {emergencyContact.phone}</p>
        <p className="text-gray-600">Email: {emergencyContact.email}</p>

        <div className="mt-4">
          <a
            href={`tel:${emergencyContact.phone}`}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
          >
            Call
          </a>
          <a
            href={`mailto:${emergencyContact.email}`}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactPage;
