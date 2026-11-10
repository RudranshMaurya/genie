import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isAnanya: boolean;
  loginAsAnanya: (passcode?: string) => Promise<boolean>;
  loginAsAdmin: (secretKey: string) => Promise<boolean>;
  logout: () => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'genie_active_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check saved local login session first
    const saved = localStorage.getItem(LOCAL_USER_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    } else {
      // Default to guest/Ananya visitor mode so she is immediately in the magical world
      const defaultAnanya: UserProfile = {
        uid: 'ananya-heart',
        email: 'ananya@genie.magic',
        name: 'Ananya',
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      setUser(defaultAnanya);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(defaultAnanya));
    }

    if (isFirebaseConfigured) {
      const unsub = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          // If logged in via firebase
          const role = fbUser.email?.includes('admin') ? 'admin' : 'user';
          const profile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email,
            name: role === 'admin' ? 'Rudransh (Genie Admin)' : 'Ananya',
            role,
            createdAt: new Date().toISOString(),
          };
          setUser(profile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        }
        setLoading(false);
      });
      return unsub;
    } else {
      setLoading(false);
    }
  }, []);

  const loginAsAnanya = async (name: string = 'Ananya') => {
    setAuthError(null);
    const profile: UserProfile = {
      uid: 'ananya-' + Date.now(),
      email: 'ananya@genie.magic',
      name: name || 'Ananya',
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    setUser(profile);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    return true;
  };

  const loginAsAdmin = async (secretKey: string) => {
    setAuthError(null);
    // Secret admin key check or Firebase email auth
    const cleanKey = secretKey.trim();
    if (cleanKey === 'ananyamyworld' || cleanKey === 'admin123' || cleanKey === 'genie2026') {
      const profile: UserProfile = {
        uid: 'admin-master-uid',
        email: 'admin@genie.magic',
        name: 'Creator & Administrator',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      setUser(profile);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      return true;
    }

    if (isFirebaseConfigured && cleanKey.includes('@')) {
      try {
        await signInWithEmailAndPassword(auth, cleanKey, 'AdminSecurePass!');
        return true;
      } catch (err: any) {
        setAuthError(err.message || 'Firebase Admin authentication failed');
        return false;
      }
    }

    setAuthError('Incorrect secret master key. Only the administrator may enter.');
    return false;
  };

  const logout = async () => {
    localStorage.removeItem(LOCAL_USER_KEY);
    if (isFirebaseConfigured) {
      try {
        await fbSignOut(auth);
      } catch {}
    }
    // Switch to standard user mode
    loginAsAnanya();
  };

  const isAdmin = user?.role === 'admin';
  const isAnanya = user?.role === 'user' || !user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isAnanya,
        loginAsAnanya,
        loginAsAdmin,
        logout,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
