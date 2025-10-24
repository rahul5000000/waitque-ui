import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [flows, setFlows] = useState(null);

  return (
    <AppContext.Provider value={{ company, setCompany, customer, setCustomer, flows, setFlows }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
