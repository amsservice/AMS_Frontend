"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { getDashboardPath } from "@/lib/roleRedirect";

/* ================= TYPES ================= */

export type Role = "principal" | "teacher" | "student" | "coordinator";

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  activeRole: Role;
}

interface RegisterSchoolPayload {
  schoolName: string;
  schoolEmail: string;
  establishedYear: number;
  phone: string;
  address: string;
  pincode: string;
  schoolType: string;
  board: string;
  city: string;
  district: string;
  state: string;
  principalName: string;
  principalEmail: string;
  principalPassword: string;
  principalgender?: string;
  principalExperience?: number;
}

/* ================= STATE ================= */

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" };

interface AuthContextType extends AuthState {
  login: (
    role: Role,
    data: { email: string; password: string; schoolCode: number }
  ) => Promise<void>;
  registerSchool: (data: RegisterSchoolPayload) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  switchRole: (role: Role) => void;
  clearError: () => void;
  setAuthUser: (user: Omit<User, "activeRole">) => void;
}

/* ================= REDUCER ================= */

const initialState: AuthState = {
  user: null,
  loading: true,
  isAuthenticated: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, error: null };

    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload,
        loading: false,
        isAuthenticated: true,
        error: null,
      };

    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        loading: false,
        isAuthenticated: false,
        error: action.payload,
      };

    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, loading: false };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | null>(null);

/* ================= PROVIDER ================= */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  /* ---------- Restore session ---------- */
  useEffect(() => {
    refetchUser();
  }, []);

  /* ---------- Helpers ---------- */

  function resolveActiveRole(roles: Role[]): Role {
    const saved = localStorage.getItem("activeRole") as Role | null;
    if (saved && roles.includes(saved)) return saved;
    return roles[0];
  }

  async function fetchMe() {
    return apiFetch("/api/auth/me");
  }

  /* ---------- Fetch current user ---------- */
  async function refetchUser() {
    dispatch({ type: "AUTH_START" });

    try {
      const res = await fetchMe();

      const activeRole = resolveActiveRole(res.user.roles);

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          ...res.user,
          activeRole,
        },
      });
    } catch {
      dispatch({
        type: "AUTH_FAILURE",
        payload: "Session expired",
      });
    }
  }

  /* ---------- Switch role ---------- */
  function switchRole(role: Role) {
    if (!state.user?.roles.includes(role)) return;

    localStorage.setItem("activeRole", role);

    dispatch({
      type: "AUTH_SUCCESS",
      payload: { ...state.user, activeRole: role },
    });

    router.push(getDashboardPath(role));
  }

  /* ---------- Register ---------- */
  async function registerSchool(data: RegisterSchoolPayload) {
    dispatch({ type: "AUTH_START" });

    try {
      await apiFetch("/api/auth/register-school", {
        method: "POST",
        body: JSON.stringify(data),
      });

      await refetchUser();
      router.push("/dashboard");
    } catch (err: any) {
      dispatch({
        type: "AUTH_FAILURE",
        payload: err.message || "Registration failed",
      });
      throw err;
    }
  }

  /* ---------- Login ---------- */
  async function login(
    role: Role,
    data: { email: string; password: string; schoolCode: number }
  ) {
    dispatch({ type: "AUTH_START" });

    try {
      const endpointMap: Record<Role, string> = {
        principal: "/api/auth/principal/login",
        teacher: "/api/auth/teacher/login",
        student: "/api/auth/student/login",
        coordinator: "/api/auth/teacher/login", // coordinator uses staff login
      };

      await apiFetch(endpointMap[role], {
        method: "POST",
        body: JSON.stringify(data),
      });

      const res = await fetchMe();
      const roles: Role[] = Array.isArray(res?.user?.roles) ? res.user.roles : [];
      const activeRole = roles.includes(role) ? role : resolveActiveRole(roles);
      localStorage.setItem("activeRole", activeRole);

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          ...res.user,
          activeRole,
        },
      });

      router.push(getDashboardPath(activeRole));
    } catch (err: any) {
      dispatch({
        type: "AUTH_FAILURE",
        payload: err.message || "Login failed",
      });
      throw err;
    }
  }

  function setAuthUser(user: Omit<User, "activeRole">) {
    const activeRole = resolveActiveRole(user.roles);
    localStorage.setItem("activeRole", activeRole);

    dispatch({
      type: "AUTH_SUCCESS",
      payload: {
        ...user,
        activeRole,
      },
    });
  }


  /* ---------- Logout ---------- */
  async function logout() {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {}

    localStorage.removeItem("activeRole");
    dispatch({ type: "LOGOUT" });
    router.replace("/auth/school-code");
  }

  function clearError() {
    dispatch({ type: "CLEAR_ERROR" });
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        registerSchool,
        logout,
        refetchUser,
        switchRole,
        clearError,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
