import axios from "axios";
import { 
  retrieveAccessToken, 
  retrieveRefreshToken, 
  saveAccessToken, 
  deleteTokens 
} from "./tokenStorage";

export type userType = "ADMIN" | "FIELD_USER";
export const backendApi = axios.create();

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
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return backendApi(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await deleteTokens();
        throw err;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

async function refreshAccessToken() {
  const refreshToken = await retrieveRefreshToken();

  // ALWAYS talk to the user-service for refresh
  const response = await axios.post(`http://10.0.0.236:8084/api/auth/refresh`, {
    refreshToken,
  });

  const newAccessToken = response.data.accessToken;
  await saveAccessToken(newAccessToken);

  return newAccessToken;
}

export default backendApi;
