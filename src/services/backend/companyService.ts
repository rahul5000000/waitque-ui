import {backendApi, userType, mapUserTypeToPath} from "./backendApi";

const COMPANY_BASE = "http://10.0.0.236:8082";

export const companyService = {
  getCompany: (userType: userType) => backendApi.get(`${COMPANY_BASE}/api/${mapUserTypeToPath(userType)}/config/companyInfo`),
};
