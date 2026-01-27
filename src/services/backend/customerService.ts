import {backendApi, userType, mapUserTypeToPath} from "./backendApi";
import qs from "qs";

// const CUSTOMER_BASE = "http://10.0.0.151:8083";
// const CUSTOMER_BASE = "https://api.waitque.com/3";
const CUSTOMER_BASE = process.env.EXPO_PUBLIC_CUSTOMER_BASE as string;

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
  sendMobileLogs: (payload: any, userType: userType) => backendApi.post(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/mobileLogs`, payload),
  getImageUploadUrl: (customerId: number, fileName: string, mimeType: string) => backendApi.get(`${CUSTOMER_BASE}/api/field/customers/${customerId}/questionnaires/*/responses/photoUploadUrl?fileName=${encodeURIComponent(fileName)}&contentType=${encodeURIComponent(mimeType)}`),
  removePhoto: (customerId: number, path: string) => backendApi.delete(`${CUSTOMER_BASE}/api/field/customers/${customerId}/questionnaires/*/responses/photoUpload?photoPath=${encodeURIComponent(path)}`),
  createQuestionnaireResponse: (customerId: number, questionnaireId: number, answers: any[], status: string, userType: userType) => {
    const payload = {
      questionnaireId: questionnaireId,
      status: status,
      answers: answers
    };
    return backendApi.post(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/customers/${customerId}/questionnaires/${questionnaireId}/responses`, payload);
  },
  getQuestionnaireResponseDetail: (customerId: number, questionnaireResponseId: number, userType: userType) => backendApi.get(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/customers/${customerId}/questionnaires/*/responses/${questionnaireResponseId}`),
  updateQuestionnaireResponse: (customerId: number, questionnaireId: number, questionnaireResponseId: number, answers: any[], status: string, userType: userType) => {
    const payload = {
      questionnaireId: questionnaireId,
      status: status,
      answers: answers
    };
    return backendApi.put(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/customers/${customerId}/questionnaires/*/responses/${questionnaireResponseId}`, payload);
  },
  deleteQuestionnaireResponse: (customerId: number, questionnaireResponseId: number, userType: userType) => backendApi.delete(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/customers/${customerId}/questionnaires/*/responses/${questionnaireResponseId}`),
  updateQuestionnaireResponseStatus: (customerId: number, questionnaireResponseId: number, status: questionnaireResponseStatus, userType: userType) => {
    const payload = { status: status };
    return backendApi.patch(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/customers/${customerId}/questionnaires/*/responses/${questionnaireResponseId}/status`, payload);
  },
  createCustomer: (customerData: any, userType: userType) => backendApi.post(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/customers`, customerData),
  getAdminDasboardMetrics: (userType: userType) => backendApi.get(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/dashboard/metrics`),
  searchLeads: (statuses: string[], userType: userType, limit = 10, page = 0) => {
    const statusParam = statuses.length > 0 ? `&status=${statuses.join(',')}` : '';
    return backendApi.get(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/leads?limit=${limit}&page=${page}${statusParam}`);
  },
  searchMessages: (statuses: string[], userType: userType, limit = 10, page = 0) => {
    const statusParam = statuses.length > 0 ? `&status=${statuses.join(',')}` : '';
    return backendApi.get(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/messages?limit=${limit}&page=${page}${statusParam}`);
  },
  getLead: (leadId: number, userType: userType) => backendApi.get(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/leads/${leadId}`),
  getMessage: (messageId: number, userType: userType) => backendApi.get(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/messages/${messageId}`),
  updateMessageStatus: (messageId: number, status: string, userType: userType) => {
    const payload = qs.stringify({
      status: status
    });
    return backendApi.patch(`${CUSTOMER_BASE}/api/${mapUserTypeToPath(userType)}/messages/${messageId}/status`, payload,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
  }
};
