import backendApi from "./backendApi";

// const USER_BASE = "http://10.0.0.151:8084";
// const USER_BASE = "https://api.waitque.com/1";
const USER_BASE = process.env.EXPO_PUBLIC_USER_BASE as string;

export const userService = {
  getMe: () => backendApi.get(`${USER_BASE}/api/users/me`),
};
