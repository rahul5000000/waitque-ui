import {backendApi, userType, mapUserTypeToPath} from "./backendApi";
import qs from "qs";

const CUSTOMER_BASE = "http://10.0.0.236:8083";

export type questionnaireResponseStatus = "ACTIVE" | "INACTIVE";

export const customerService = {
  customerSearch: (searchTerm: string, userType: userType) => {
    const body = qs.stringify({
      companyName: searchTerm,
      firstName: searchTerm,
      lastName: searchTerm,
      crmCustomerId: searchTerm,
      address: searchTerm,
      phoneNumber: searchTerm
    });

    return backendApi.post(
      `${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/customers/search`,
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  },
  getCustomer: (customerId: number, userType: userType) => backendApi.get(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/customers/${customerId}`),
  assignQrCode: (qrCode: string, customerId: number, userType: userType) => backendApi.put(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/customers/${customerId}/qrCode`, {"qrCode": qrCode}),
  unassignQrCode: (customerId: number, userType: userType) => backendApi.delete(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/customers/${customerId}/qrCode`),
  getQuestionnaireResponses: (customerId: number, statuses: questionnaireResponseStatus[], userType: userType, limit = 10, page = 0) => backendApi.get(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/customers/${customerId}/questionnaires/*/responses?status=${statuses.join(',')}&limit=${limit}&page=${page}`),
};
