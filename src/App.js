import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NavBar from './components/Navbar';
import AIChatPage from './pages/AIChatPage'; // Import the AI Chat Page

// Import all page components
import HomePage from './pages/HomePage';
import FacesPage from './pages/FacesPage';
import FactsPage, { CategoryPage } from './pages/FactsPage';
import ToDoPage from './pages/ToDoPage';
import MedicationsPage from './pages/MedicationsPage';
import PracticePage from './pages/PracticePage'; // Import Practice Page
import PracticeReminderPage from './pages/PracticeReminderPage'; // Import Practice Reminder Page
import EmergencyContactPage from './pages/EmergencyContactPage';
import SignupPage from './pages/SignupPage';

// Create a simple AuthContext
export const AuthContext = React.createContext(null);

const App = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Save the current path to localStorage whenever the location changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('lastVisitedRoute', location.pathname);
    }
  }, [location, user]);

  useEffect(() => {
    // Retrieve the last visited route from localStorage
    const storedUser = localStorage.getItem('user');
    const lastVisitedRoute = localStorage.getItem('lastVisitedRoute') || '/';

    if (storedUser) {
      setUser(JSON.parse(storedUser));

      // If user is already logged in, redirect to the last visited route or home page
      if (lastVisitedRoute) {
        navigate(lastVisitedRoute);
      } else {
        navigate('/');
      }
    } else {
      navigate('/signup'); // Redirect to signup if not logged in
    }
  }, [navigate]);

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/signup" replace />;
    }
    return children;
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_OAUTH_CLIENT_ID"> {/* Replace with your actual Client ID */}
      <AuthContext.Provider value={{ user, setUser }}>
        <div className="min-h-screen bg-gray-100">
          {user && <NavBar />} {/* Show NavBar only if user is logged in */}
          
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={user ? <HomePage /> : <Navigate to="/signup" replace />} />
            <Route path="/faces" element={<ProtectedRoute><FacesPage /></ProtectedRoute>} />
            <Route path="/facts" element={<ProtectedRoute><FactsPage /></ProtectedRoute>} />
            <Route path="/ai-chat" element={<ProtectedRoute><AIChatPage /></ProtectedRoute>} /> {/* AI Chat Page */}
            <Route path="/category/:categoryId" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
            <Route path="/todo" element={<ProtectedRoute><ToDoPage /></ProtectedRoute>} />
            <Route path="/medications" element={<ProtectedRoute><MedicationsPage /></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute><PracticePage /></ProtectedRoute>} /> {/* Practice Page */}
            <Route path="/practice-reminder" element={<ProtectedRoute><PracticeReminderPage /></ProtectedRoute>} /> {/* Practice Reminder Page */}
            <Route path="/emergency-contact" element={<ProtectedRoute><EmergencyContactPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
