import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const savedState = localStorage.getItem('globalState');
    return savedState ? JSON.parse(savedState) : {
      user: null,
      tasks: [],
      faces: [],
      facts: [],
      medications: [],
      emergencyContacts: []
    };
  });

  useEffect(() => {
    localStorage.setItem('globalState', JSON.stringify(state));
  }, [state]);

  const updateState = (key, value) => {
    setState(prevState => ({ ...prevState, [key]: value }));
  };

  return (
    <GlobalStateContext.Provider value={{ state, updateState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};