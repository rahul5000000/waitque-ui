import {backendApi, userType, mapUserTypeToPath} from "./backendApi";

// const COMPANY_BASE = "http://10.0.0.151:8082";
// const COMPANY_BASE = "https://api.waitque.com/2";
const COMPANY_BASE = process.env.EXPO_PUBLIC_COMPANY_BASE as string;

export type questionnaireStatus = "ACTIVE" | "INACTIVE";

export const companyService = {
  getCompany: (userType: userType) => backendApi.get(`${COMPANY_BASE}/api/${mapUserTypeToPath(userType)}/config/companyInfo`),
  getQuestionnaires: (statuses: questionnaireStatus[], userType: userType, limit = 10, page = 0) => backendApi.get(`${COMPANY_BASE}/api/${mapUserTypeToPath(userType)}/questionnaires?status=${statuses.join(',')}&limit=${limit}&page=${page}`),
  getQuestionnaire: (questionnaireId: number, userType: userType) => backendApi.get(`${COMPANY_BASE}/api/${mapUserTypeToPath(userType)}/questionnaires/${questionnaireId}`),
  generateQRCodes: (numCodes: number, userType: userType) => backendApi.get(`${COMPANY_BASE}/api/${mapUserTypeToPath(userType)}/config/qrcode?count=${numCodes}`,
  {
      responseType: 'arraybuffer', // Important: get binary data
  }),
  getUsers: (userType: userType) => backendApi.get(`${COMPANY_BASE}/api/${mapUserTypeToPath(userType)}/company/users`),
  createUser: (userTypeToCreate: userType, userData: any, userType: userType) => backendApi.post(`${COMPANY_BASE}/api/${mapUserTypeToPath(userType)}/company/users/${mapUserTypeToPath(userTypeToCreate)}`, userData),
  updateUserStatus: (userId: number, isActive: boolean, userType: userType) => backendApi.patch(`${COMPANY_BASE}/api/${mapUserTypeToPath(userType)}/company/users/${userId}/status/${isActive ? 'ENABLED' : 'DISABLED'}`),
  deleteUser: (userId: number, userType: userType) => backendApi.delete(`${COMPANY_BASE}/api/${mapUserTypeToPath(userType)}/company/users/${userId}`),
};
