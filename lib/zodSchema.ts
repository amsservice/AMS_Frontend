import { z } from "zod";

export const registerSchoolSchema = z.object({
  schoolName: z.string().min(3, "School name must be at least 3 characters"),
  schoolEmail: z.string().email("Invalid email address"),

  phone: z.string().regex(/^\d{6}$/, "Phone number must be 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),

  principalName: z.string().min(3, "Principal name must be at least 3 characters"),
  principalEmail: z.string().email("Invalid email address"),
  principalPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.principalPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterSchoolFormData = z.infer<typeof registerSchoolSchema>;