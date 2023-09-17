import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    
    setUser(userData);
    localStorage.setItem('token',userData.token)
    console.log("Inside context", user)
  };

  const logout = () => {
    setUser(null);
    localStorage.clear()
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
