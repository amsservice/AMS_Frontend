


// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode
// } from "react";
// import { apiFetch } from "@/lib/api";


// /* ------------------------------------
//    Types
// ------------------------------------ */

// type Role = "principal" | "teacher" | "student";

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: Role;
// }

// interface RegisterSchoolPayload {
//   schoolName: string;
//   schoolEmail: string;
//   phone: string;
//   address: string;
//   pincode: string;
//   principalName: string;
//   principalEmail: string;
//   principalPassword: string;
//   orderId:string;
//   paymentId: string;
// }

// interface LoginPayload {
//   email: string;
//   password: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   registerSchool: (data: RegisterSchoolPayload) => Promise<void>;
//   login: (role: Role, data: LoginPayload) => Promise<void>;
//   logout: () => Promise<void>;
//   refetchUser: () => Promise<void>;
// }

// /* ------------------------------------
//    Context
// ------------------------------------ */

// const AuthContext = createContext<AuthContextType | null>(null);

// /* ------------------------------------
//    Provider
// ------------------------------------ */

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     refetchUser();
//   }, []);

//   /* ------------------------------------
//      Fetch logged-in user
//   ------------------------------------ */
//   async function refetchUser() {
//     try {
//       const res = await apiFetch("/api/auth/principal/me");
//       setUser(res.user);
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   }

  


//   /* ------------------------------------
//      Login (Principal / Teacher / Student)
//   ------------------------------------ */
//   async function login(role: Role, data: LoginPayload) {
//     const endpointMap: Record<Role, string> = {
//       principal: "/api/auth/principal/login",
//       teacher: "/api/auth/teacher/login",
//       student: "/api/auth/student/login"
//     };

//     const res = await apiFetch(endpointMap[role], {
//       method: "POST",
//       body: JSON.stringify(data)
//     });

//     // ✅ store token (localStorage mode)
//     localStorage.setItem("accessToken", res.accessToken);

//     setUser(res.user);
//   }

//   /* ------------------------------------
//      Register School
//   ------------------------------------ */
//   async function registerSchool(data: RegisterSchoolPayload) {
//     const res = await apiFetch("/api/auth/register-school", {
//       method: "POST",
//       body: JSON.stringify(data)
//     });

//     localStorage.setItem("accessToken", res.accessToken);
//     setUser(res.user);
//   }

//   /* ------------------------------------
//      Logout (BACKEND + FRONTEND)
//   ------------------------------------ */
//   async function logout() {
//     try {
//       // 🔥 call backend logout (optional but recommended)
//       await apiFetch("/api/auth/logout", {
//         method: "POST"
//       });
//     } catch {
//       // ignore backend errors on logout
//     } finally {
//       // ✅ clear frontend auth
//       localStorage.removeItem("accessToken");
//       setUser(null);
//     }
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         login,
//         logout,
//         registerSchool,
//         refetchUser
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// /* ------------------------------------
//    Hook
// ------------------------------------ */

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("useAuth must be used inside AuthProvider");
//   }
//   return ctx;
// }




"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";
import { apiFetch } from "@/lib/api";

/* ================= TYPES ================= */

type Role = "principal" | "teacher" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (role: Role, data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | null>(null);

/* ================= PROVIDER ================= */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* -------- Restore session on refresh -------- */
  useEffect(() => {
    refetchUser();
  }, []);

  /* -------- Fetch Logged-in User -------- */
 async function refetchUser() {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role") as Role | null;

  if (!token || !role) {
    console.log("❌ NO TOKEN OR ROLE");
    setLoading(false);
    return;
  }

  const meEndpoint: Record<Role, string> = {
    principal: "/api/auth/principal/me",
    teacher: "/api/teacher/me",
    student: "/api/student/me"
  };

  try {
    const res = await apiFetch(meEndpoint[role]);

    console.log("🔥 FULL /ME RESPONSE:", res); // 👈 IMPORTANT
    console.log("🔥 res.user:", res.user);

    setUser(res.user ?? null);
  } catch (err) {
    console.error("❌ /ME FAILED:", err);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    setUser(null);
  } finally {
    setLoading(false);
  }
}


  /* -------- Login -------- */
  async function login(
    role: Role,
    data: { email: string; password: string }
  ) {
    const endpointMap: Record<Role, string> = {
      principal: "/api/auth/principal/login",
      teacher: "/api/auth/teacher/login",
      student: "/api/auth/student/login"
    };

    const res = await apiFetch(endpointMap[role], {
      method: "POST",
      body: JSON.stringify(data)
    });

    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("role", role);

    await refetchUser();

  console.log("LOGIN SUCCESS ✅");
  console.log("Token stored, user fetched via /me");

  //   setUser(res.user);
  //   console.log("LOGIN SUCCESS ✅");
  // console.log("User:", res.user);
  // console.log("Role:", role);
  // console.log("Access Token:", res.accessToken);
  }

  /* -------- Logout -------- */
  async function logout() {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {}
    finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
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
        refetchUser
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

