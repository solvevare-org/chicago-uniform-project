import axios, { AxiosError } from "axios";

const API_BASE_URL = "http://31.97.41.27:5000"; // Replace with your actual API base URL

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchProductsByCategory = async (
  categoryId: string
): Promise<any> => {
  if (!categoryId) {
    console.error("Error: categoryId is required but was not provided.");
    throw new Error("categoryId is required");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/categories/${categoryId}/products`,
      {
        timeout: 5000, // Set timeout to 5 seconds
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error("Error fetching products:", axiosError.response.data);
    } else if (axiosError.request) {
      console.error(
        "Error fetching products: No response received",
        axiosError.request
      );
    } else {
      console.error("Error fetching products:", axiosError.message);
    }
    throw axiosError;
  }
};

export const fetchProductDetails = async (productId: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error fetching product details:", axiosError.message);
    throw axiosError;
  }
};

export const fetchProductsByBaseCategory = async (
  subcategory: string,
  limit: number = 40,
  offset: number = 0
): Promise<any> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/products/by-base-category/${subcategory}`,
      {
        params: { limit, offset },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error(
        "Error fetching products by base category:",
        axiosError.response.data
      );
    } else if (axiosError.request) {
      console.error(
        "Error fetching products by base category: No response received",
        axiosError.request
      );
    } else {
      console.error(
        "Error fetching products by base category:",
        axiosError.message
      );
    }
    throw axiosError;
  }
};

export const fetchStylesByBaseCategory = async (
  subcategory: string,
  limit: number = 1000,
  offset: number = 0
): Promise<any> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/styles/base-categories/${subcategory}`,
      {
        params: { limit, offset },
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error(
        "Error fetching styles by base category:",
        axiosError.response.data
      );
    } else if (axiosError.request) {
      console.error(
        "Error fetching styles by base category: No response received",
        axiosError.request
      );
    } else {
      console.error(
        "Error fetching styles by base category:",
        axiosError.message
      );
    }
    throw axiosError;
  }
};
