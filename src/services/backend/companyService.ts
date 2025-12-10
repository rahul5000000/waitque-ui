import {backendApi, userType, mapUserTypeToPath} from "./backendApi";

const COMPANY_BASE = "http://10.0.0.236:8082";

export type questionnaireStatus = "ACTIVE" | "INACTIVE";

export const companyService = {
  getCompany: (userType: userType) => backendApi.get(`${COMPANY_BASE}/api/${mapUserTypeToPath(userType)}/config/companyInfo`),
  getQuestionnaires: (statuses: questionnaireStatus[], userType: userType, limit = 10, page = 0) => backendApi.get(`${COMPANY_BASE}/api/${mapUserTypeToPath(userType)}/questionnaires?status=${statuses.join(',')}&limit=${limit}&page=${page}`),
};
