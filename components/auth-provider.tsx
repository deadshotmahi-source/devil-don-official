"use client";

import {
  createContext,
  useContext,
  ReactNode,
} from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

interface AuthContextType {
  register: (
    username: string,
    password: string
  ) => Promise<void>;

  login: (
    username: string,
    password: string
  ) => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const register = async (
    username: string,
    password: string
  ) => {
    await createUserWithEmailAndPassword(
      auth,
      username,
      password
    );
  };

  const login = async (
    username: string,
    password: string
  ) => {
    await signInWithEmailAndPassword(
      auth,
      username,
      password
    );
  };

  return (
    <AuthContext.Provider
      value={{ register, login }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}