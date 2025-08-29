import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Partner, AuthContextData } from './../types';
import { ApiService } from './../services/api';

let AsyncStorage: any;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {

    AsyncStorage = {
    getItem: async (key: string) => {
      console.warn('AsyncStorage not available, using fallback');
      return null;
    },
    setItem: async (key: string, value: string) => {
      console.warn('AsyncStorage not available, using fallback');
    },
    removeItem: async (key: string) => {
      console.warn('AsyncStorage not available, using fallback');
    }
  };
}


const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = '@cdcBank:partner';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredPartner();
  }, []);

  const loadStoredPartner = async () => {
    try {
      const storedPartner = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedPartner) {
        setPartner(JSON.parse(storedPartner));
      }
    } catch (error) {
      console.error('Error loading stored partner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const authenticatedPartner = await ApiService.login(email, password);
      
      if (authenticatedPartner) {
        setPartner(authenticatedPartner);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedPartner));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setPartner(null);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        partner,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};