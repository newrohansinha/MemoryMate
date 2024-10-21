import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('useEffect is running...'); // To check if the effect is triggered
    const storedUser = localStorage.getItem('user');
    console.log('Stored user in localStorage:', storedUser); // To check what's in localStorage

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Parsed user data:", parsedUser); // To check the parsed user object
      setUser(parsedUser);

      // Log the user's email to the console
      console.log("User's email:", parsedUser.email);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
