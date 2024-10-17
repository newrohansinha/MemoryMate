import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FacesPage from './pages/FacesPage';
import FactsPage from './pages/FactsPage';
import ToDoPage from './pages/ToDoPage';
import MedicationsPage from './pages/MedicationsPage';
import AiAssistantPage from './pages/AiAssistantPage';
import EmergencyContactPage from './pages/EmergencyContactPage';
import SignupPage from './pages/SignupPage';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/faces" element={<FacesPage />} />
        <Route path="/facts" element={<FactsPage />} />
        <Route path="/todo" element={<ToDoPage />} />
        <Route path="/medications" element={<MedicationsPage />} />
        <Route path="/ai-assistant" element={<AiAssistantPage />} />
        <Route path="/emergency-contact" element={<EmergencyContactPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    

    </div>
    
  );
};

export default App;
