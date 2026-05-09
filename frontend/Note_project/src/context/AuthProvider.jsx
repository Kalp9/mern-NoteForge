import { useCallback, useMemo, useState } from "react";
import { loginUser, signupUser } from "../services/authService";
import { AuthContext } from "./AuthContext";

const getStoredAuth = () => {
  const token = localStorage.getItem("noteforge_token");
  const storedUser = localStorage.getItem("noteforge_user");

  try {
    return {
      token,
      user: storedUser ? JSON.parse(storedUser) : null,
    };
  } catch {
    localStorage.removeItem("noteforge_token");
    localStorage.removeItem("noteforge_user");
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const storedAuth = getStoredAuth();
  const [token, setToken] = useState(storedAuth.token);
  const [user, setUser] = useState(storedAuth.user);

  const saveSession = useCallback((authData) => {
    localStorage.setItem("noteforge_token", authData.token);
    localStorage.setItem("noteforge_user", JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
  }, []);

  const signup = useCallback(
    async (formData) => {
      const authData = await signupUser(formData);
      saveSession(authData);
      return authData;
    },
    [saveSession]
  );

  const login = useCallback(
    async (formData) => {
      const authData = await loginUser(formData);
      saveSession(authData);
      return authData;
    },
    [saveSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("noteforge_token");
    localStorage.removeItem("noteforge_user");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      signup,
      login,
      logout,
    }),
    [login, logout, signup, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
