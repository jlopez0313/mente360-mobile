import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  isNewUser?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isNewUser: boolean;
  clearNewUserFlag: () => void;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS_KEY = "mente360_users";
const CURRENT_USER_KEY = "mente360_current_user";

const getStoredUsers = (): Record<string, { password: string; user: User }> => {
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Default mock user
  const defaultUsers = {
    "demo@mente360.com": {
      password: "demo123",
      user: {
        id: "1",
        email: "demo@mente360.com",
        name: "Usuario Demo",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      },
    },
  };
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

const saveUsers = (users: Record<string, { password: string; user: User }>) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getStoredUsers();
    const userEntry = users[email.toLowerCase()];

    if (!userEntry) {
      return { error: "No existe una cuenta con este correo electrónico" };
    }

    if (userEntry.password !== password) {
      return { error: "Contraseña incorrecta" };
    }

    setUser(userEntry.user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userEntry.user));
    return {};
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getStoredUsers();

    if (users[email.toLowerCase()]) {
      return { error: "Ya existe una cuenta con este correo electrónico" };
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };

    users[email.toLowerCase()] = {
      password,
      user: newUser,
    };

    saveUsers(users);
    setUser(newUser);
    setIsNewUser(true);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return {};
  };

  const clearNewUserFlag = () => {
    setIsNewUser(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const resetPassword = async (email: string): Promise<{ error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getStoredUsers();

    if (!users[email.toLowerCase()]) {
      return { error: "No existe una cuenta con este correo electrónico" };
    }

    // In a real app, this would send an email
    // For mock, we'll just return success
    return {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isNewUser,
        clearNewUserFlag,
        login,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
