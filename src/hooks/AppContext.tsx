import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Customer User Context
  const [company, setCompany] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [flows, setFlows] = useState(null);
  const [backendBaseUrl, setBackendBaseUrl] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [questionnaires, setQuestionnaires] = useState(null);

  // Company User Context
  const [user, setUser] = useState(null);

  const clearContext = () => {
    setCompany(null);
    setCustomer(null);
    setFlows(null);
    setBackendBaseUrl(null);
    setQrCode(null);
    setQuestionnaires(null);
    setUser(null);
  }

  return (
    <AppContext.Provider value={{
      clearContext,
      company, setCompany, 
      customer, setCustomer, 
      flows, setFlows, 
      backendBaseUrl, setBackendBaseUrl, 
      qrCode, setQrCode, 
      questionnaires, setQuestionnaires,
      user, setUser}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
