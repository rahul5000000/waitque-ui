import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type AuthMode = "customer" | "admin" | "none";

interface AuthContextType {
  mode: AuthMode;
  customerCode: string | null;
  accessToken: string | null;
  refreshToken?: string | null;

  loginCustomer: (customerCode: string) => Promise<void>;
  loginAdmin: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;

  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [mode, setMode] = useState<AuthMode>("none");
  const [customerCode, setCustomerCode] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
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
        const refresh = await SecureStore.getItemAsync("refreshToken");
        setMode("admin");
        setAccessToken(token);
        setRefreshToken(refresh);
      }

      setIsLoaded(true);
    })();
  }, []);

  // Login as customer
  const loginCustomer = async (code: string) => {
    await SecureStore.setItemAsync("auth_mode", "customer");
    await SecureStore.setItemAsync("customerCode", code);

    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");

    setMode("customer");
    setCustomerCode(code);
    setAccessToken(null);
    setRefreshToken(null);
  };

  // Login as admin
  const loginAdmin = async (token: string, refreshToken: string) => {
    await SecureStore.setItemAsync("auth_mode", "admin");
    await SecureStore.setItemAsync("accessToken", token);
    await SecureStore.setItemAsync("refreshToken", refreshToken);

    await SecureStore.deleteItemAsync("customerCode");

    setMode("admin");
    setAccessToken(token);
    setRefreshToken(refreshToken);
    setCustomerCode(null);
  };

  // Logout (both types)
  const logout = async () => {
    await SecureStore.deleteItemAsync("auth_mode");
    await SecureStore.deleteItemAsync("customerCode");
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");

    setMode("none");
    setCustomerCode(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ mode, customerCode, accessToken, loginCustomer, loginAdmin, logout, isLoaded, refreshToken }}
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