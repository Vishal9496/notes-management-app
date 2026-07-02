import { createContext, useState, useEffect, useCallback } from 'react';
import { getToken, getStoredUser, isTokenExpired, logoutUser } from '../services/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getToken();
    if (t && !isTokenExpired(t)) {
      setToken(t);
      setUser(getStoredUser());
    } else if (t) {
      logoutUser();
      setToken(null);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = useCallback((data) => {
    setToken(data.token);
    setUser({ name: data.name, email: data.email });
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
