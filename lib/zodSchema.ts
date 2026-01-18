import { z } from "zod";

export const registerSchoolSchema = z
  .object({

    /* ===============================
       SCHOOL DETAILS
    =============================== */
    schoolName: z.string().min(3, "School name must be at least 3 characters"),

    schoolEmail: z.string().email("Invalid email address"),

    establishedYear: z.preprocess(
      (value) => {
        if (value === "" || value === null || value === undefined) return value;
        return value;
      },
      z.coerce
        .number()
        .int("Established year must be a valid year")
        .min(1900, "Established year must be 1900 or later")
        .max(new Date().getFullYear(), "Established year cannot be in the future")
    ),

    phone: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be 10 digits"),

    address: z
      .string()
      .trim()
      .min(10, "Address must be at least 10 characters")
      .regex(/[A-Za-z]/, "Address must contain at least 1 letter"),

    pincode: z
      .string()
      .regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),

    schoolType: z.enum(["Government", "Private", "Semi-Private"], {
      message: "Invalid school type"
    }),

    board: z.string().min(2, "Board is required"),

    city: z
      .string()
      .trim()
      .min(3, "City must be at least 3 characters")
      .refine(
        (value) => (value.match(/[A-Za-z]/g) || []).length >= 3,
        "City must contain at least 3 letters"
      ),

    district: z
      .string()
      .trim()
      .min(3, "District must be at least 3 characters")
      .refine(
        (value) => (value.match(/[A-Za-z]/g) || []).length >= 3,
        "District must contain at least 3 letters"
      ),

    state: z
      .string()
      .trim()
      .min(3, "State is required")
      .regex(/^[A-Za-z\s]+$/, "State must contain characters only"),

    /* ===============================
       PRINCIPAL DETAILS
    =============================== */
    principalName: z
      .string()
      .min(3, "Principal name must be at least 3 characters"),

    principalEmail: z.string().email("Invalid email address"),

    principalPhone: z
      .string()
      .regex(/^\d{10}$/, "Principal phone number must be 10 digits"),

    principalQualification: z
      .string()
      .trim()
      .min(2, "Qualification must be at least 2 characters")
      .max(100, "Qualification must be at most 100 characters"),

    principalPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    gender: z
      .enum(["Male", "Female", "Other"])
      .optional(),

    yearsOfExperience: z.preprocess(
      (value) => {
        if (value === '' || value === null || value === undefined) return undefined;
        return value;
      },
      z.coerce
        .number()
        .min(0, "Experience cannot be negative")
        .max(42, "Experience cannot exceed 42 years")
        .optional()
    )
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