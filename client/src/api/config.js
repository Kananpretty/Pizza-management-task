// This checks if you are on localhost or a deployed site
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  MENU: `${BASE_URL}/api/menu`,
  ORDERS: `${BASE_URL}/api/orders`,
};
