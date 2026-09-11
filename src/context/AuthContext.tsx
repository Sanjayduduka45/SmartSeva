import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginWithMobile: (mobile: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  registerWithMobile: (fullName: string, mobile: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  getUserInitials: (name?: string) => string;
}

const STORAGE_KEY_USER = 'smartseva_auth_user_v2';
const STORAGE_KEY_USERS_DB = 'smartseva_users_db_v2';

// Helper to calculate clean avatar initials
export const getUserInitials = (fullName?: string): string => {
  if (!fullName || !fullName.trim()) return 'CITIZEN';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved user', e);
    }
    // Default verified citizen fallback profile if none in storage
    return {
      id: 'user-default-101',
      fullName: 'Rajesh Kumar',
      mobileNumber: '9876543210',
      email: 'rajesh.kumar@example.com',
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: true
    };
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }, [user]);

  // Helper to store registered users in local mock database for demo login simulation
  const getStoredUsersDb = (): Record<string, { password?: string; profile: UserProfile }> => {
    try {
      const dbStr = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (dbStr) return JSON.parse(dbStr);
    } catch (e) {
      console.error(e);
    }
    return {};
  };

  const saveToUsersDb = (key: string, data: { password?: string; profile: UserProfile }) => {
    try {
      const db = getStoredUsersDb();
      db[key] = data;
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(db));
    } catch (e) {
      console.error(e);
    }
  };

  // Mobile Login
  const loginWithMobile = async (mobile: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }
    if (otp !== '000000' && otp.length !== 6) {
      return { success: false, error: 'Please enter the full 6-digit verification code.' };
    }
    if (otp === '000000') {
      return { success: false, error: "The verification code didn't match. Please try again." };
    }

    const db = getStoredUsersDb();
    const existing = db[`mobile_${cleanMobile}`]?.profile;

    const loggedUser: UserProfile = existing || {
      id: `usr_mob_${cleanMobile}`,
      fullName: user?.fullName && user.fullName !== 'Anjali Sharma' ? user.fullName : 'Citizen User',
      mobileNumber: cleanMobile,
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: true
    };

    setUser(loggedUser);
    saveToUsersDb(`mobile_${cleanMobile}`, { profile: loggedUser });
    return { success: true };
  };

  // Mobile Registration
  const registerWithMobile = async (
    fullName: string,
    mobile: string,
    otp: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!fullName || fullName.trim().length < 2) {
      return { success: false, error: 'Please enter your full legal name.' };
    }
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
    }
    if (otp !== '000000' && otp.length !== 6) {
      return { success: false, error: 'Please enter the full 6-digit verification code.' };
    }
    if (otp === '000000') {
      return { success: false, error: "The verification code didn't match. Please try again." };
    }

    const newUser: UserProfile = {
      id: `usr_mob_${cleanMobile}_${Date.now()}`,
      fullName: fullName.trim(),
      mobileNumber: cleanMobile,
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: true
    };

    setUser(newUser);
    saveToUsersDb(`mobile_${cleanMobile}`, { profile: newUser });
    return { success: true };
  };

  // Email Login
  const loginWithEmail = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const db = getStoredUsersDb();
    const record = db[`email_${cleanEmail}`];

    if (record) {
      if (record.password && record.password !== password) {
        return { success: false, error: 'Incorrect password. Please try again or reset.' };
      }
      setUser(record.profile);
      return { success: true };
    }

    // Default simulation for new email login
    const nameFromEmail = cleanEmail.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = nameFromEmail
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const loggedUser: UserProfile = {
      id: `usr_em_${Date.now()}`,
      fullName: formattedName.length > 2 ? formattedName : 'Citizen User',
      email: cleanEmail,
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: true
    };

    setUser(loggedUser);
    saveToUsersDb(`email_${cleanEmail}`, { password, profile: loggedUser });
    return { success: true };
  };

  // Email Registration
  const registerWithEmail = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!fullName || fullName.trim().length < 2) {
      return { success: false, error: 'Please enter your full legal name.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const newUser: UserProfile = {
      id: `usr_em_${Date.now()}`,
      fullName: fullName.trim(),
      email: cleanEmail,
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: true
    };

    setUser(newUser);
    saveToUsersDb(`email_${cleanEmail}`, { password, profile: newUser });
    return { success: true };
  };

  // Logout
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {
      console.error(e);
    }
  };

  // Update Profile
  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithMobile,
        registerWithMobile,
        loginWithEmail,
        registerWithEmail,
        logout,
        updateProfile,
        getUserInitials
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
