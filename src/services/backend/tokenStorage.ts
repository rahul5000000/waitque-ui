import { setItem, getItem, deleteItem } from "./secureStoreWrapper";

// Save tokens
export const saveAccessToken = (token) =>
  setItem("accessToken", token);

export const saveRefreshToken = (token) =>
  setItem("refreshToken", token);

// Get tokens
export const retrieveAccessToken = () =>
  getItem("accessToken");

export const retrieveRefreshToken = () =>
  getItem("refreshToken");

// Clear both
export const deleteTokens = async () => {
  await deleteItem("accessToken");
  await deleteItem("refreshToken");
};
