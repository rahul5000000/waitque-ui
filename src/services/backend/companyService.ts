import {backendApi, userType, mapUserTypeToPath} from "./backendApi";

const COMPANY_BASE = "http://10.0.0.236:8082";
// const COMPANY_BASE = "http://waitque-alb-1208411922.us-east-1.elb.amazonaws.com/2";

export type questionnaireStatus = "ACTIVE" | "INACTIVE";

export const companyService = {
  getCompany: (userType: userType) => backendApi.get(`${COMPANY_BASE}/api/${mapUserTypeToPath(userType)}/config/companyInfo`),
  getQuestionnaires: (statuses: questionnaireStatus[], userType: userType, limit = 10, page = 0) => backendApi.get(`${COMPANY_BASE}/api/${mapUserTypeToPath(userType)}/questionnaires?status=${statuses.join(',')}&limit=${limit}&page=${page}`),
  getQuestionnaire: (questionnaireId: number, userType: userType) => backendApi.get(`${COMPANY_BASE}/api/${mapUserTypeToPath(userType)}/questionnaires/${questionnaireId}`),
};
