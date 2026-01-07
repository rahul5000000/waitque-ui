import axios from "axios";

// const CUSTOMER_BASE = "http://10.0.0.236:8083";
const CUSTOMER_BASE = "https://api.waitque.com/3";

export const backendApi = axios.create();

export const publicService = {
  getMe: (qrCode: string) => backendApi.get(`${CUSTOMER_BASE}/api/public/customers/qrCode/${qrCode}/me`),
  getCompany: (qrCode: string) => backendApi.get(`${CUSTOMER_BASE}/api/public/customers/qrCode/${qrCode}/company`),
  getFlows: (qrCode: string, limit = 10, page = 0) => backendApi.get(`${CUSTOMER_BASE}/api/public/customers/qrCode/${qrCode}/company/flows?limit=${limit}&page=${page}`),
  getFlow: (qrCode: string, flowId: number) => backendApi.get(`${CUSTOMER_BASE}/api/public/customers/qrCode/${qrCode}/company/leadFlows/${flowId}`),
  getQuestionnaireResponses: (qrCode: string, limit = 10, page = 0) => backendApi.get(`${CUSTOMER_BASE}/api/public/customers/qrCode/${qrCode}/questionnaires/*/responses?status=ACTIVE&limit=${limit}&page=${page}`),
  getQuestionnaireResponse: (qrCode: string, questionnaireResponseId: number) => backendApi.get(`${CUSTOMER_BASE}/api/public/customers/qrCode/${qrCode}/questionnaires/*/responses/${questionnaireResponseId}`),
  sendMessage: (qrCode: string, message: string) => backendApi.post(`${CUSTOMER_BASE}/api/public/customers/qrCode/${qrCode}/messages`, {"message": message}),
  removePhoto: (qrCode: string, path: string) => backendApi.delete(`${CUSTOMER_BASE}/api/public/customers/qrCode/${qrCode}/leads/photoUpload?photoPath=${encodeURIComponent(path)}`),
  getImageUploadUrl: (qrCode: string, fileName: string, mimeType: string) => backendApi.get(`${CUSTOMER_BASE}/api/public/customers/qrCode/${qrCode}/leads/photoUploadUrl?fileName=${encodeURIComponent(fileName)}&contentType=${encodeURIComponent(mimeType)}`),
  createLead: (qrCode: string, flowId: number, answers: any[]) => backendApi.post(`${CUSTOMER_BASE}/api/public/customers/qrCode/${qrCode}/leads`, {leadFlowId: flowId, answers: answers}),
  sendMobileLogs: (qrCode: string, payload: any) => backendApi.post(`${CUSTOMER_BASE}/api/public/customers/qrCode/${qrCode}/mobileLogs`, payload),
};