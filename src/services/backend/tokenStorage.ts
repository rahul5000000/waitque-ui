import * as SecureStore from "expo-secure-store";

// Save tokens
export const setAccessToken = (token) =>
  SecureStore.setItemAsync("accessToken", token);

export const setRefreshToken = (token) =>
  SecureStore.setItemAsync("refreshToken", token);

// Get tokens
export const getAccessToken = () =>
  SecureStore.getItemAsync("accessToken");

export const getRefreshToken = () =>
  SecureStore.getItemAsync("refreshToken");

// Clear both
export const clearSession = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
};
