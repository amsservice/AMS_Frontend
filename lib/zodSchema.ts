import { z } from "zod";

export const registerSchoolSchema = z
  .object({
    /* ===============================
       SCHOOL DETAILS
    =============================== */
    schoolName: z.string().min(3, "School name must be at least 3 characters"),

    schoolEmail: z.string().email("Invalid email address"),

    phone: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be 10 digits"),

    address: z
      .string()
      .min(10, "Address must be at least 10 characters"),

    pincode: z
      .string()
      .regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),

    schoolType: z.enum(["Government", "Private", "Semi-Private"], {
      message: "Invalid school type"
    }),

    board: z.string().min(2, "Board is required"),

    city: z.string().min(2, "City is required"),

    district: z.string().min(2, "District is required"),

    state: z.string().min(2, "State is required"),

    /* ===============================
       PRINCIPAL DETAILS
    =============================== */
    principalName: z
      .string()
      .min(3, "Principal name must be at least 3 characters"),

    principalEmail: z.string().email("Invalid email address"),

    principalPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    // ✅ NEW (OPTIONAL)
    principalGender: z
      .enum(["Male", "Female", "Other"])
      .optional(),

    // ⚠️ IMPORTANT: must be number (frontend must convert)
    principalExperience: z
      .number()
      .min(0, "Experience cannot be negative")
      .max(60, "Experience cannot exceed 60 years")
      .optional()
  })
  .refine(
    (data) => data.principalPassword === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"]
    }
  );



export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterSchoolFormData = z.infer<typeof registerSchoolSchema>;