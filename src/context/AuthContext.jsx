import { createContext, useContext, useState } from 'react';
import { authenticate, registerUser, getInitials } from '../data/users';

const AuthContext = createContext(null);

const ALLOWED_DOMAINS = (import.meta.env.VITE_ALLOWED_EMAIL_DOMAINS || 'g.ucla.edu,ucla.edu').split(',');

export function isUCLAEmail(email) {
  const domain = (email || '').split('@')[1] || '';
  return ALLOWED_DOMAINS.includes(domain);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('r2r_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  function login(email, password) {
    const found = authenticate(email, password);
    if (!found) return 'Incorrect email or password.';
    const userData = { ...found, initials: getInitials(found.firstName, found.lastName) };
    sessionStorage.setItem('r2r_user', JSON.stringify(userData));
    setUser(userData);
    return null;
  }

  function register(data) {
    const result = registerUser(data);
    if (result.error) return result.error;
    const userData = { ...data, initials: getInitials(data.firstName, data.lastName) };
    sessionStorage.setItem('r2r_user', JSON.stringify(userData));
    setUser(userData);
    return null;
  }

  function logout() {
    sessionStorage.removeItem('r2r_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
