import api from "../api/api";

export const fetchOrders = async () => {
  try {
    const response = await api.get("/orders");

    return response.data;
  } catch (error) {
    // Axios errors contain the response if the server replied
    const message = error.response?.data?.message || error.message;
    console.error("Failed to fetch orders:", message);

    throw error;
  }
};
