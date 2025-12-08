import * as SecureStore from "expo-secure-store";

// Save tokens
export const saveAccessToken = (token) =>
  SecureStore.setItemAsync("accessToken", token);

export const saveRefreshToken = (token) =>
  SecureStore.setItemAsync("refreshToken", token);

// Get tokens
export const retrieveAccessToken = () =>
  SecureStore.getItemAsync("accessToken");

export const retrieveRefreshToken = () =>
  SecureStore.getItemAsync("refreshToken");

// Clear both
export const deleteTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
};
