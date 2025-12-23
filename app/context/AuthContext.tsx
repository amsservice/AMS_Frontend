


"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";
import { apiFetch } from "@/lib/api";

/* ------------------------------------
   Types
------------------------------------ */

type Role = "principal" | "teacher" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface RegisterSchoolPayload {
  schoolName: string;
  schoolEmail: string;
  phone: string;
  address: string;
  pincode: string;
  principalName: string;
  principalEmail: string;
  principalPassword: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  registerSchool: (data: RegisterSchoolPayload) => Promise<void>;
  login: (role: Role, data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

/* ------------------------------------
   Context
------------------------------------ */

const AuthContext = createContext<AuthContextType | null>(null);

/* ------------------------------------
   Provider
------------------------------------ */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    refetchUser();
  }, []);

  /* ------------------------------------
     Fetch logged-in user
  ------------------------------------ */
  async function refetchUser() {
    try {
      const res = await apiFetch("/api/auth/me");
      setUser(res.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------
     Login (Principal / Teacher / Student)
  ------------------------------------ */
  async function login(role: Role, data: LoginPayload) {
    const endpointMap: Record<Role, string> = {
      principal: "/api/auth/principal/login",
      teacher: "/api/auth/teacher/login",
      student: "/api/auth/student/login"
    };

    const res = await apiFetch(endpointMap[role], {
      method: "POST",
      body: JSON.stringify(data)
    });

    // ✅ store token (localStorage mode)
    localStorage.setItem("accessToken", res.accessToken);

    setUser(res.user);
  }

  /* ------------------------------------
     Register School
  ------------------------------------ */
  async function registerSchool(data: RegisterSchoolPayload) {
    const res = await apiFetch("/api/auth/register-school", {
      method: "POST",
      body: JSON.stringify(data)
    });

    localStorage.setItem("accessToken", res.accessToken);
    setUser(res.user);
  }

  /* ------------------------------------
     Logout (BACKEND + FRONTEND)
  ------------------------------------ */
  async function logout() {
    try {
      // 🔥 call backend logout (optional but recommended)
      await apiFetch("/api/auth/logout", {
        method: "POST"
      });
    } catch {
      // ignore backend errors on logout
    } finally {
      // ✅ clear frontend auth
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        registerSchool,
        refetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ------------------------------------
   Hook
------------------------------------ */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
