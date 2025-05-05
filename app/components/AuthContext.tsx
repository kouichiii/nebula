"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { users, User } from "../data/users";

interface AuthContextType {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // localStorageから復元
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (userId) {
      const found = users.find((u) => u.id === userId);
      if (found) setUser(found);
    }
  }, []);

  const login = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setUser(found);
      localStorage.setItem("userId", userId);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
} 