import React, { useState } from 'react';

const FactsPage = () => {
  const [facts, setFacts] = useState(JSON.parse(localStorage.getItem('facts')) || []);
  const [newFact, setNewFact] = useState('');

  const handleAddFact = () => {
    const updatedFacts = [...facts, newFact];
    setFacts(updatedFacts);
    localStorage.setItem('facts', JSON.stringify(updatedFacts));
    setNewFact('');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Important Facts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {facts.map((fact, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <p className="text-gray-800">{fact}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <input
          type="text"
          placeholder="Add a fact"
          value={newFact}
          onChange={(e) => setNewFact(e.target.value)}
          className="p-3 border rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-300 w-full sm:w-auto"
          onClick={handleAddFact}
        >
          Add Fact
        </button>
      </div>
    </div>
  );
};

export default FactsPage;