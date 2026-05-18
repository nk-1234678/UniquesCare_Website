/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { getErrorMessage } from "../api/httpClient";

const AuthContext = createContext(null);
let isFetching = false;
let authRequest = null;

export const AuthProvider = ({ children }) => {
  const STORAGE_KEY = "auth_user";
  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async (options = {}) => {
    const { force = false } = options;

    if (!force && isFetching && authRequest) {
      return authRequest;
    }

    isFetching = true;
    authRequest = (async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await authApi.getCurrentUser();
      const nextUser = data?.user || null;
      setUser(nextUser);
      try {
        if (nextUser) localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        else localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore storage errors
      }
      return nextUser;
    } catch (err) {
      setUser(null);
      setError(getErrorMessage(err, "Failed to authenticate user"));
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore storage removal error
      }
      return null;
    } finally {
      setLoading(false);
      isFetching = false;
      authRequest = null;
    }
    })();

    return authRequest;
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const onSessionExpired = () => {
      setUser(null);
      setError("Your session expired. Please log in again.");
      try {
        localStorage.removeItem("auth_user");
      } catch {
        // ignore storage removal error
      }
    };

    window.addEventListener("auth:session-expired", onSessionExpired);
    return () => window.removeEventListener("auth:session-expired", onSessionExpired);
  }, []);

  const login = async (payload) => {
    const data = await authApi.login(payload);
    if (!data || !data.user) {
      throw new Error("Invalid login response");
    }

    setUser(data.user);
    try {
      localStorage.setItem("auth_user", JSON.stringify(data.user));
    } catch {
      // ignore parse error
    }
    setError(null);
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      setError(null);
      try {
        localStorage.removeItem("auth_user");
      } catch {
        // ignore storage removal error
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        refreshUser: fetchUser,
        isAuthenticated: Boolean(user),
        clearAuthError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};