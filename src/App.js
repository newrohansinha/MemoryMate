import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NavBar from './components/Navbar';
import PracticePage from './pages/PracticePage';

// Import all page components
import HomePage from './pages/HomePage';
import FacesPage from './pages/FacesPage';
import FactsPage, { CategoryPage } from './pages/FactsPage';
import ToDoPage from './pages/ToDoPage';
import MedicationsPage from './pages/MedicationsPage';
import AiAssistantPage from './pages/AiAssistantPage';
import EmergencyContactPage from './pages/EmergencyContactPage';
import SignupPage from './pages/SignupPage';

// Create a simple AuthContext
export const AuthContext = React.createContext(null);

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/signup" replace />;
    }
    return children;
  };

  return (
    <GoogleOAuthProvider clientId="1064795131152-iv0f3ai8gv0rncaj4ou1jecurih2pqg6.apps.googleusercontent.com">
      <AuthContext.Provider value={{ user, setUser }}>
        <div className="min-h-screen bg-gray-100">
          {user && <NavBar />}
          
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={
              user ? <HomePage /> : <Navigate to="/signup" replace />
            } />
            <Route path="/faces" element={<ProtectedRoute><FacesPage /></ProtectedRoute>} />
            <Route path="/facts" element={<ProtectedRoute><FactsPage /></ProtectedRoute>} />
         <Route path="/practice" element={<PracticePage />} />

            <Route path="/category/:categoryId" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
            <Route path="/todo" element={<ProtectedRoute><ToDoPage /></ProtectedRoute>} />
            <Route path="/medications" element={<ProtectedRoute><MedicationsPage /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AiAssistantPage /></ProtectedRoute>} />
            <Route path="/emergency-contact" element={<ProtectedRoute><EmergencyContactPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default App;