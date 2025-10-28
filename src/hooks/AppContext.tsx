import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [flows, setFlows] = useState(null);
  const [backendBaseUrl, setBackendBaseUrl] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  return (
    <AppContext.Provider value={{ company, setCompany, customer, setCustomer, flows, setFlows, backendBaseUrl, setBackendBaseUrl, qrCode, setQrCode }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
