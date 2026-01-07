import backendApi from "./backendApi";

// const USER_BASE = "http://10.0.0.236:8084";
const USER_BASE = "https://api.waitque.com/1";

export const userService = {
  getMe: () => backendApi.get(`${USER_BASE}/api/users/me`),
};
