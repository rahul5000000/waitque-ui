import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type AuthMode = "customer" | "admin" | "none";

interface AuthContextType {
  mode: AuthMode;
  customerCode: string | null;
  accessToken: string | null;

  loginCustomer: (customerCode: string) => Promise<void>;
  loginAdmin: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;

  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [mode, setMode] = useState<AuthMode>("none");
  const [customerCode, setCustomerCode] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted auth on startup
  useEffect(() => {
    (async () => {
      const storedMode = await SecureStore.getItemAsync("auth_mode");

      console.log("Loaded auth mode from storage:", storedMode);

      if (storedMode === "customer") {
        const code = await SecureStore.getItemAsync("customerCode");
        setMode("customer");
        setCustomerCode(code);
      } else if (storedMode === "admin") {
        const token = await SecureStore.getItemAsync("accessToken");
        setMode("admin");
        setAccessToken(token);
      }

      setIsLoaded(true);
    })();
  }, []);

  // Login as customer
  const loginCustomer = async (code: string) => {
    await SecureStore.setItemAsync("auth_mode", "customer");
    await SecureStore.setItemAsync("customerCode", code);

    await SecureStore.deleteItemAsync("accessToken");

    setMode("customer");
    setCustomerCode(code);
    setAccessToken(null);
  };

  // Login as admin
  const loginAdmin = async (token: string) => {
    await SecureStore.setItemAsync("auth_mode", "admin");
    await SecureStore.setItemAsync("accessToken", token);

    await SecureStore.deleteItemAsync("customerCode");

    setMode("admin");
    setAccessToken(token);
    setCustomerCode(null);
  };

  // Logout (both types)
  const logout = async () => {
    await SecureStore.deleteItemAsync("auth_mode");
    await SecureStore.deleteItemAsync("customerCode");
    await SecureStore.deleteItemAsync("accessToken");

    setMode("none");
    setCustomerCode(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ mode, customerCode, accessToken, loginCustomer, loginAdmin, logout, isLoaded }}
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
