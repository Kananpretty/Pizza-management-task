import { API_ENDPOINTS } from "./config";

export const fetchMenu = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.MENU);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();

    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch menu:", error);
    throw error; // Re-throw so the component can handle the error state
  }
};
