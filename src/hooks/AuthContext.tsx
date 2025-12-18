import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  retrieveAccessToken, 
  retrieveRefreshToken, 
  saveAccessToken, 
  saveRefreshToken,
  deleteTokens 
} from "../services/backend/tokenStorage";
import { setItem, getItem, deleteItem } from "../services/backend/secureStoreWrapper";

type AuthMode = "customer" | "admin" | "none";

interface AuthContextType {
  mode: AuthMode;
  customerCode: string | null;

  loginCustomer: (customerCode: string) => Promise<void>;
  loginAdmin: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;

  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [mode, setMode] = useState<AuthMode>("none");
  const [customerCode, setCustomerCode] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted auth on startup
  useEffect(() => {
    (async () => {
      const storedMode = await getItem("auth_mode");

      if (storedMode === "customer") {
        const code = await getItem("customerCode");
        setMode("customer");
        setCustomerCode(code);
      } else if (storedMode === "admin") {
        const token = await retrieveAccessToken();
        const refresh = await retrieveRefreshToken();
        if (token && refresh) {
          setMode("admin");
        }
      }

      setIsLoaded(true);
    })();
  }, []);

  // Login as customer
  const loginCustomer = async (code: string) => {
    await setItem("auth_mode", "customer");
    await setItem("customerCode", code);

    await deleteTokens();

    setMode("customer");
    setCustomerCode(code);
  };

  // Login as admin
  const loginAdmin = async (token: string, refreshToken: string) => {
    await setItem("auth_mode", "admin");
    await saveAccessToken(token);
    await saveRefreshToken(refreshToken);

    await deleteItem("customerCode");

    setMode("admin");
    setCustomerCode(null);
  };

  // Logout (both types)
  const logout = async () => {
    await deleteItem("auth_mode");
    await deleteItem("customerCode");
    await deleteTokens();

    setMode("none");
    setCustomerCode(null);
  };

  return (
    <AuthContext.Provider
      value={{ mode, customerCode, loginCustomer, loginAdmin, logout, isLoaded }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}