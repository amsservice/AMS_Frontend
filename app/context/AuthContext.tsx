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

/* ================= TYPES ================= */

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

/* ================= STATE TYPES ================= */

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
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean };

interface AuthContextType extends AuthState {
  login: (
    role: Role,
    data: { email: string; password: string; schoolCode: number },
  ) => Promise<void>;
  registerSchool: (data: RegisterSchoolPayload) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  setAuthUser: (user: User) => void;
  clearError: () => void;
}

/* ================= INITIAL STATE & REDUCER ================= */

const initialState: AuthState = {
  user: null,
  loading: true,
  isAuthenticated: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
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
      return {
        ...state,
        user: null,
        loading: false,
        isAuthenticated: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
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

  /* -------- Restore session on refresh -------- */
  useEffect(() => {
    refetchUser();
  }, []);

  function setAuthUser(user: User) {
    dispatch({ type: "AUTH_SUCCESS", payload: user });
  }

  /* -------- Fetch Logged-in User -------- */
  async function refetchUser() {
    dispatch({ type: "AUTH_START" });

    try {
      // Try each role endpoint until we find a valid session
      const roles: Role[] = ["principal", "teacher", "student"];
      let userFound = false;

      for (const role of roles) {
        try {
          const meEndpoint: Record<Role, string> = {
            principal: "/api/auth/principal/me",
            teacher: "/api/teacher/me",
            student: "/api/student/me",
          };

          const res = await apiFetch(meEndpoint[role]);

          if (res.user) {
            dispatch({ type: "AUTH_SUCCESS", payload: res.user });
            userFound = true;
            break;
          }
        } catch (err) {
          // Continue to next role
          continue;
        }
      }

      if (!userFound) {
        dispatch({ type: "AUTH_FAILURE", payload: "No valid session found" });
      }
    } catch (err) {
      dispatch({ type: "AUTH_FAILURE", payload: "Failed to verify session" });
    }
  }

  /* ------------------------------------
  //      Register School
  //   ------------------------------------ */
  async function registerSchool(data: RegisterSchoolPayload) {
    dispatch({ type: "AUTH_START" });

    try {
      const res = await apiFetch("/api/auth/register-school", {
        method: "POST",
        body: JSON.stringify(data),
      });

      // Cookies are set automatically by the backend
      dispatch({ type: "AUTH_SUCCESS", payload: res.user });
      router.push("/dashboard");
    } catch (error: any) {
      dispatch({
        type: "AUTH_FAILURE",
        payload: error.message || "Registration failed",
      });
      throw error;
    }
  }

  /* -------- Login -------- */
  async function login(
    role: Role,
    data: { email: string; password: string; schoolCode: number },
  ) {
    dispatch({ type: "AUTH_START" });
    
    try {
      const endpointMap: Record<Role, string> = {
        principal: "/api/auth/principal/login",
        teacher: "/api/auth/teacher/login",
        student: "/api/auth/student/login",
      };

      const res = await apiFetch(endpointMap[role], {
        method: "POST",
        body: JSON.stringify(data),
      });

      // Cookies are set automatically by the backend
      dispatch({ type: "AUTH_SUCCESS", payload: res.user });
      router.push("/dashboard");
    } catch (error: any) {
      dispatch({
        type: "AUTH_FAILURE",
        payload: error.message || "Login failed",
      });
      throw error;
    }
  }

  /* -------- Logout -------- */
  async function logout() {
    dispatch({ type: "AUTH_START" });

    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "LOGOUT" });
      router.replace("/auth/school-code");
    }
  }

  /* -------- Clear Error -------- */
  function clearError() {
    dispatch({ type: "CLEAR_ERROR" });
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        registerSchool,
        refetchUser,
        setAuthUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}

/* ================= SELECTORS (Optional) ================= */

export function useAuthUser() {
  const { user } = useAuth();
  return user;
}

export function useAuthLoading() {
  const { loading } = useAuth();
  return loading;
}

export function useAuthError() {
  const { error, clearError } = useAuth();
  return { error, clearError };
}

export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}
