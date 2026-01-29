import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('aeternacy_demo_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Auth initialization failed", e);
    }
    setLoading(false);
  }, []);

  const createMockUser = (email: string, isAnonymous: boolean = false, displayName?: string): User => ({
    uid: isAnonymous ? 'guest-123' : `user-${Date.now()}`,
    email: email,
    displayName: displayName || (isAnonymous ? 'Guest User' : email.split('@')[0]),
    emailVerified: true,
    isAnonymous: isAnonymous,
    photoURL: isAnonymous ? 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' : null,
    metadata: {} as any,
    providerData: [],
    refreshToken: 'mock-refresh-token',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-id-token',
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
    providerId: 'password',
  });

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockUser = createMockUser(email);
    setUser(mockUser);
    try {
      localStorage.setItem('aeternacy_demo_user', JSON.stringify(mockUser));
    } catch (e) {}
  };

  const signup = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockUser = createMockUser(email);
    setUser(mockUser);
    try {
      localStorage.setItem('aeternacy_demo_user', JSON.stringify(mockUser));
    } catch (e) {}
  };

  const logout = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setUser(null);
    try {
      localStorage.removeItem('aeternacy_demo_user');
    } catch (e) {}
  };

  const loginAsGuest = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const guestUser = createMockUser('guest@aeternacy.com', true);
    setUser(guestUser);
    try {
      localStorage.setItem('aeternacy_demo_user', JSON.stringify(guestUser));
    } catch (e) {}
  };

  const loginWithGoogle = async () => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const googleUser = createMockUser('sarah.doe@gmail.com', false, 'Sarah Doe');
    setUser(googleUser);
    try {
      localStorage.setItem('aeternacy_demo_user', JSON.stringify(googleUser));
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, loginAsGuest, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};