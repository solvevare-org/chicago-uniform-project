// API Configuration with fallback support
const DEFAULT_API_URL = "http://localhost:3000/api";

// Try to use environment variable, fallback to proxy in development, then to direct IP
const getApiBaseUrl = () => {
  // In development with Vite, use the proxy
  if (process.env.NODE_ENV === "development") {
    return "/api"; // This will use the Vite proxy
  }

  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  return DEFAULT_API_URL;
};

const API_BASE_URL = getApiBaseUrl();

// For development proxy, don't modify the URL. For others, ensure proper format
const getBaseUrl = () => {
  if (API_BASE_URL === "/api") {
    return ""; // Empty base for proxy
  }
  return API_BASE_URL.replace("/api", "");
};

const baseUrl = getBaseUrl();
const apiPath = API_BASE_URL === "/api" ? "/api" : `${baseUrl}/api`;

export const API_ENDPOINTS = {
  BASE_URL: apiPath,

  // Auth endpoints
  AUTH: {
    LOGIN: `${apiPath}/auth/login`,
    LOGOUT: `${apiPath}/auth/logout`,
    ME: `${apiPath}/auth/me`,
  },

  // Product endpoints
  PRODUCTS: {
    SEARCH: `${apiPath}/products/search`,
    BY_CATEGORY: `${apiPath}/products/by-base-category`,
    BY_BRAND: `${apiPath}/products/by-brand`,
    BY_KEYWORD: `${apiPath}/products/by-keyword`,
    BY_SKU: `${apiPath}/products/sku`,
    PROCESS: `${apiPath}/process-product`,
  },

  // Category endpoints
  CATEGORIES: {
    BASE: `${apiPath}/categories`,
    BASE_CATEGORIES: `${apiPath}/styles/base-categories`,
    SUBCATEGORIES: `${apiPath}/styles/subcategories`,
    TITLES: `${apiPath}/styles/titles`,
  },

  // Brand endpoints
  BRANDS: {
    ALL: `${apiPath}/brands/`,
    BRAND_NAMES: `${apiPath}/styles/brand-names`,
  },

  // Order endpoints
  ORDERS: {
    PENDING: `${apiPath}/orders/pending`,
  },
};

// Helper function to build API URLs
export const buildApiUrl = (
  endpoint: string,
  params?: Record<string, string | number>
) => {
  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }
  return url;
};

// Helper function for making API requests with error handling
export const apiRequest = async (url: string, options?: RequestInit) => {
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  };

  try {
    console.log("Making API request to:", url);
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API request successful:", url);
    return data;
  } catch (error) {
    console.error("API Request failed for URL:", url, "Error:", error);
    throw error;
  }
};
