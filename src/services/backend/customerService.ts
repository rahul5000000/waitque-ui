import {backendApi, userType, mapUserTypeToPath} from "./backendApi";
import qs from "qs";

const CUSTOMER_BASE = "http://10.0.0.236:8083";
// const CUSTOMER_BASE = "http://waitque-alb-1208411922.us-east-1.elb.amazonaws.com/3";

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
  }
};
