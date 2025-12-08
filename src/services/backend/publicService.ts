import axios from "axios";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const CUSTOMER_BASE = "http://10.0.0.236:8083";

export const backendApi = axios.create();

export const publicService = {
  getMe: (qrCode: string) => backendApi.get(`${CUSTOMER_BASE}/api/public/customers/qrCode/${qrCode}/me`),
  getCompany: (qrCode: string) => backendApi.get(`${CUSTOMER_BASE}/api/public/customers/qrCode/${qrCode}/company`),
  getFlows: (qrCode: string, limit = 10, page = 0) => backendApi.get(`${CUSTOMER_BASE}/api/public/customers/qrCode/${qrCode}/company/flows?limit=${limit}&page=${page}`),
  getQuestionnaireResponses: (qrCode: string, limit = 10, page = 0) => backendApi.get(`${CUSTOMER_BASE}/api/public/customers/qrCode/${qrCode}/questionnaires/*/responses?status=ACTIVE&limit=${limit}&page=${page}`),
};