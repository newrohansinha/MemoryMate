import React, { useState } from 'react';

const AiAssistantPage = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleAskAi = async () => {
    // Placeholder for AI response logic
    setResponse(`You asked: "${input}". This is where AI would respond.`);
    setInput('');
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">AI Assistant</h2>
      <p className="text-gray-600 mb-6">Ask anything and the assistant will help you.</p>

      <div>
        <input
          type="text"
          placeholder="Ask the AI Assistant"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="p-2 border rounded-md w-full mb-4"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={handleAskAi}>
          Ask AI
        </button>
      </div>

      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md shadow-md">
          <p className="text-lg">{response}</p>
        </div>
      )}
    </div>
  );
};

export default AiAssistantPage;
