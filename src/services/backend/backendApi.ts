import axios from "axios";
import { 
  retrieveAccessToken, 
  retrieveRefreshToken, 
  saveAccessToken, 
  deleteTokens, 
  saveRefreshToken
} from "./tokenStorage";
import { refreshAccessToken } from "../authService";
import { navigate } from "../navigationService";

export type userType = "ADMIN" | "FIELD_USER";
export const backendApi = axios.create();
export const mapUserTypeToPath = (userType: userType): string => {
  switch(userType) {
    case "ADMIN":
      return "admin";
    case "FIELD_USER":
      return "field";
    default:
      throw new Error(`Unsupported user type: ${userType}`);
  }
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

backendApi.interceptors.request.use(
  async (config) => {
    const token = await retrieveAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

backendApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return backendApi(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return backendApi(originalRequest);
      } catch (err) {
        try {
          processQueue(err, null);
          await deleteTokens();
        } catch (e) {
          console.log("Failed to cleanup state on auth failure:", e);
        }
        
        navigate("Landing");
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

async function refreshToken() {
  const refreshToken = await retrieveRefreshToken();
  const newTokens = await refreshAccessToken(refreshToken);

  await saveAccessToken(newTokens.access_token);
  await saveRefreshToken(newTokens.refresh_token);

  return newTokens.access_token;
}

export default backendApi;
