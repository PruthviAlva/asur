import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true on first load

  // On app start — check if token exists and validate it
  useEffect(() => {
    const token = localStorage.getItem("asur_token");
    if (!token) {
      setLoading(false);
      return;
    }

    // Verify token is still valid with the server
    authService
      .getMe()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem("asur_token")) // token expired
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    localStorage.setItem("asur_token", data.token);
    setUser(data.user);
    return data;
  };

  const register = async (email, username, password) => {
    const data = await authService.register({ email, username, password });
    localStorage.setItem("asur_token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("asur_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — cleaner than useContext(AuthContext) everywhere
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
