// src/context/UserContext.jsx

import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('guest'); // default role

  return (
    <UserContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
};

// THIS is the named export you're using in RoleSwitcher
export const useUser = () => {
  return useContext(UserContext);
};