export const useUserData = (dataKey) => {
    const userEmail = localStorage.getItem('userEmail');
    
    const loadData = () => {
      const storedData = localStorage.getItem(`${dataKey}_${userEmail}`);
      return storedData ? JSON.parse(storedData) : [];
    };
  
    const saveData = (data) => {
      localStorage.setItem(`${dataKey}_${userEmail}`, JSON.stringify(data));
    };
  
    return { loadData, saveData };
  };