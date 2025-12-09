import {backendApi, userType, mapUserTypeToPath} from "./backendApi";
import qs from "qs";

const CUSTOMER_BASE = "http://10.0.0.236:8083";

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
  }
};
