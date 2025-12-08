import {backendApi, userType} from "./backendApi";

const COMPANY_BASE = "http://10.0.0.236:8082";

const mapUserTypeToPath = (userType: userType): string => {
  switch(userType) {
    case "ADMIN":
      return "admin";
    case "FIELD_USER":
      return "field";
    default:
      throw new Error(`Unsupported user type: ${userType}`);
  }
};

export const companyService = {
  getCompany: (userType: userType) => backendApi.get(`${COMPANY_BASE}/api/${mapUserTypeToPath(userType)}/config/companyInfo`),
};
