import { createContext, useContext, useState, useCallback } from "react";
import { loginUser, registerUser } from "../services/authService";
import {
  getToken,
  setToken,
  getStoredUser,
  setStoredUser,
  clearSession,
} from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getToken()));

  const login = useCallback(async ({ email, password }) => {
    const data = await loginUser({ email, password });
    setToken(data.access_token);
    // Backend login doesn't return the profile — store what we know locally.
    const profile = { email };
    setStoredUser(profile);
    setUser(profile);
    setIsAuthenticated(true);
    return data;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const data = await registerUser({ name, email, password });
    return data;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
