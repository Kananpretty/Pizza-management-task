import api from "../api/api";

export const fetchMenu = async () => {
  try {
    const response = await api.get("/menu");

    return response.data;
  } catch (error) {
    // Axios errors contain the response if the server replied
    const message = error.response?.data?.message || error.message;
    console.error("Failed to fetch menu:", message);

    throw error;
  }
};
