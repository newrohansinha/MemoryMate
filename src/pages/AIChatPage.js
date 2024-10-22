import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from "@google/generative-ai";

const AIChatPage = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(null);

  // Initialize Gemini API
  useEffect(() => {
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyADFq8gsttq6usm7j9fvlCVKufSgemYXy4");
      const modelInstance = genAI.getGenerativeModel({ model: "gemini-pro" });
      setModel(modelInstance);
    } catch (error) {
      console.error("Error initializing API:", error);
    }
  }, []);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  // Function to gather data from different pages (localStorage or API)
  const gatherAllData = () => {
    // Retrieve ToDo data from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskString = "Here are your tasks: \n";
    tasks.forEach(task => {
      taskString += `- ${task.title}: ${task.description} at ${task.time}\n`;
    });

    // Retrieve Facts from localStorage
    const facts = JSON.parse(localStorage.getItem('factCategories')) || [];
    let factsString = "Here are your facts: \n";
    facts.forEach(category => {
      factsString += `Category: ${category.name}\n`;
      category.facts.forEach(fact => factsString += `- ${fact.text}\n`);
    });

    // Retrieve Medications from localStorage
    const medications = JSON.parse(localStorage.getItem('medications')) || [];
    let medsString = "Here are your medications: \n";
    medications.forEach(med => {
      medsString += `- ${med.name}, Dose: ${med.dose}, Time: ${med.time}\n`;
    });

    // Retrieve Faces from localStorage
    const faces = JSON.parse(localStorage.getItem('faces')) || [];
    let facesString = "Here are the people you need to remember: \n";
    faces.forEach(face => {
      facesString += `- ${face.name}: ${face.description}\n`;
    });

    // Concatenate all data into one string
    const combinedData = `
    Here is all the information you have stored in the app:

    ${taskString}

    ${factsString}

    ${medsString}

    ${facesString}

    Answer the question using the information provided above. If and only if the question has absolutely nothing to do with the data and facts, you can just answer the question as you would normally, but keep it very short. Always speak in second person, adress the user as you.
    `;

    return combinedData;
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !model) return;

    // Add user message immediately
    const newMessage = { type: "user", message: userInput };
    setChatHistory(prevHistory => [...prevHistory, newMessage]);

    setIsLoading(true);
    const currentInput = userInput;
    setUserInput(""); // Clear input immediately

    try {
      // Gather all data to send with the query
      const allDataString = gatherAllData();
      
      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      // Append all data string to the user's question
      const query = `${allDataString} \n Question: ${currentInput}`;

      const result = await chat.sendMessage(query);
      const response = await result.response;
      
      if (response && response.text) {
        setChatHistory(prevHistory => [
          ...prevHistory,
          { type: "bot", message: response.text() }
        ]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Detailed error:", error);
      setChatHistory(prevHistory => [
        ...prevHistory,
        { 
          type: "bot", 
          message: "I apologize, but I encountered an error. This might be due to API limits or connectivity issues. Please make sure you're using a valid API key and try again."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-4 blue-900">AI Chatbot</h1>
      
      <div className="chat-container rounded-lg shadow-md p-4 bg-white min-h-[400px] max-h-[600px] overflow-y-auto mb-4">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`flex items-start py-2 px-4 rounded-lg mb-2 ${
              message.type === "user"
                ? "bg-gray-100 text-gray-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            <span className="mr-2 font-bold text-gray-600">
              {message.type === "user" ? "You:" : "Bot:"}
            </span>
            <div className="flex-1 whitespace-pre-wrap">
              <ReactMarkdown>{message.message}</ReactMarkdown>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && userInput.trim() && sendMessage()}
        />
        <button
          className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={sendMessage}
          disabled={isLoading || !userInput.trim() || !model}
        >
          Send
        </button>
      </div>

      {chatHistory.length > 0 && (
        <button
          className="mt-4 px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 focus:outline-none transition-colors"
          onClick={clearChat}
        >
          Clear Chat
        </button>
      )}
    </div>
  );
};

export default AIChatPage;
