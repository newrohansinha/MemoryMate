import React, { useState } from 'react';

const MedicationsPage = () => {
  const [medications, setMedications] = useState(JSON.parse(localStorage.getItem('medications')) || []);
  const [newMed, setNewMed] = useState({ name: '', dose: '', time: '', taken: false });

  const handleAddMed = () => {
    const updatedMeds = [...medications, newMed];
    setMedications(updatedMeds);
    localStorage.setItem('medications', JSON.stringify(updatedMeds));
    setNewMed({ name: '', dose: '', time: '', taken: false });
  };

  const handleToggleTaken = (index) => {
    const updatedMeds = medications.map((med, i) =>
      i === index ? { ...med, taken: !med.taken } : med
    );
    setMedications(updatedMeds);
    localStorage.setItem('medications', JSON.stringify(updatedMeds));
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Medications</h2>
      <div className="grid grid-cols-1 gap-4">
        {medications.map((med, index) => (
          <div
            key={index}
            className={`p-4 rounded-md shadow-md ${med.taken ? 'bg-green-100' : 'bg-white'}`}
          >
            <p>{med.name} - {med.dose}</p>
            <p>Time: {med.time}</p>
            <button
              className="mt-2 bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
              onClick={() => handleToggleTaken(index)}
            >
              {med.taken ? 'Mark as Not Taken' : 'Mark as Taken'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <input
          type="text"
          placeholder="Medication Name"
          value={newMed.name}
          onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
          className="p-2 border rounded-md w-full mb-2"
        />
        <input
          type="text"
          placeholder="Dose"
          value={newMed.dose}
          onChange={(e) => setNewMed({ ...newMed, dose: e.target.value })}
          className="p-2 border rounded-md w-full mb-2"
        />
        <input
          type="text"
          placeholder="Time"
          value={newMed.time}
          onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
          className="p-2 border rounded-md w-full mb-4"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={handleAddMed}>
          Add Medication
        </button>
      </div>
    </div>
  );
};

export default MedicationsPage;
