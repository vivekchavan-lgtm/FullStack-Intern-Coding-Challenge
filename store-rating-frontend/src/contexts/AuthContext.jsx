import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    
    if (token && storedRole) {
      // Set the token as a default header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setRole(storedRole);
      
      // Optionally fetch full user profile here
      // api.get('/auth/me').then(res => setUser(res.data)).catch(() => logout());
      
      setUser({ token, role: storedRole });
    }
    setLoading(false);
  }, []);

  const login = (token, userRole) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', userRole);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setRole(userRole);
    setUser({ token, role: userRole });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    delete api.defaults.headers.common['Authorization'];
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
