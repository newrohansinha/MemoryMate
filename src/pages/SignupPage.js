import React, { useContext, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App'; // Make sure this path is correct

const SignupPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSuccess = (response) => {
    try {
      const userInfo = jwtDecode(response.credential);
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      navigate('/');
    } catch (error) {
      console.error("Error decoding token:", error);
      setError("Failed to process login information. Please try again.");
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Sign-In failed:", error);
    setError("Sign-in failed. Please try again.");
  };

  const handleEmailSignup = (e) => {
    e.preventDefault();
    // Here you would typically send a request to your backend to create a new user
    // For now, we'll just simulate a successful signup
    const userInfo = { email, name: email.split('@')[0] };
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    navigate('/');
  };

  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Welcome to MemoryMate</h2>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="text-gray-600 mb-6 text-center">
          Sign up or log in to get started.
        </p>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <div className="mb-6">
          <p className="text-center mb-4">Sign up with Google:</p>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              useOneTap
              theme="filled_blue"
              shape="pill"
              size="large"
            />
          </div>
        </div>
        <div className="mb-6">
          <p className="text-center mb-4">Or sign up with email:</p>
          <form onSubmit={handleEmailSignup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;