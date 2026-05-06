import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api/v1").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message || "Request failed");
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
    this.errorName = payload?.errorName || "Request Error";
  }
}

let refreshRequest = null;

const mapAxiosError = (error) => {
  if (error instanceof ApiError) return error;

  const status = error?.response?.status;
  const payload = error?.response?.data;
  const message =
    payload?.message ||
    payload?.error ||
    error?.message ||
    "Request failed";

  return new ApiError(message, status, payload);
};

const formatErrorMessage = (error, fallbackMessage) => {
  const errorName = error?.payload?.errorName || error?.errorName;
  const message =
    error?.payload?.message ||
    error?.payload?.error ||
    error?.message ||
    fallbackMessage ||
    "Something went wrong";

  if (errorName) {
    return `${errorName}: ${message}`;
  }

  return message;
};

export const getErrorMessage = (error, fallbackMessage) => {
  if (!error) return fallbackMessage || "Something went wrong";
  if (error instanceof ApiError) {
    return formatErrorMessage(error, fallbackMessage || "Request failed");
  }
  return formatErrorMessage(error, fallbackMessage || "Something went wrong");
};

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const shouldRetry = (error, retryCount) => {
  if (retryCount >= 2) return false;

  const status = error?.response?.status;
  if (!status) return true;
  if (status >= 500) return true;
  if (status === 429) return true;
  return false;
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;
    const requestUrl = String(originalRequest?.url || "");

    const isRefreshRequest = requestUrl.includes("/auth/refresh");
    const isAuthEntryRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/logout");

    if (status === 401 && originalRequest && !originalRequest._retry && !isRefreshRequest && !isAuthEntryRequest) {
      originalRequest._retry = true;

      try {
        if (!refreshRequest) {
          refreshRequest = httpClient.post("/auth/refresh");
        }
        await refreshRequest;
        return httpClient(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:session-expired"));
        }
        throw mapAxiosError(refreshError);
      } finally {
        refreshRequest = null;
      }
    }

    const retryCount = Number(originalRequest?._retryCount || 0);
    if (originalRequest && shouldRetry(error, retryCount)) {
      originalRequest._retryCount = retryCount + 1;
      return httpClient(originalRequest);
    }

    throw mapAxiosError(error);
  }
);

export const request = async ({ method = "GET", url, data, params, headers, signal }) => {
  try {
    const response = await httpClient({
      method,
      url,
      data,
      params,
      headers,
      signal,
    });
    return response.data;
  } catch (error) {
    throw mapAxiosError(error);
  }
};
