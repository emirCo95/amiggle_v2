'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/auth/me', { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const login = async (email: string, password: string) => {
    console.log(email, password);
    await axios.post(
      'http://localhost:5000/api/auth/login',
      { email, password },
      { withCredentials: true }
    );
    const res = await axios.get('http://localhost:5000/api/auth/me', {
      withCredentials: true,
    });
    setUser(res.data);
  };

  const logout = async () => {
    await axios.post(
      'http://localhost:5000/api/auth/logout',
      {},
      { withCredentials: true }
    );
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
