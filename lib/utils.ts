import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod/v3";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pathnameHandle = (pathname: string) => {
  switch (pathname) {
    case "/admin":
      return "Dashboard";
    case "/admin/users":
      return "Users";
    case "/admin/pages":
      return "Pages";
    case "/admin/posts":
      return "Posts";
    case "/admin/media":
      return "Media";
    case "/admin/categories":
      return "Categories";
    case "/admin/globals/headers":
      return "Headers";
    case "/admin/globals/footers":
      return "Footers";
    case "/admin/globals/themes":
      return "Themes";
    case "/admin/settings":
      return "Settings";
    case "/admin/profile":
      return "Profile";
    default:
      return "Dashboard";
  }
};

// Zod Validation Schemas

// Registration Schema
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    role: z.string().default("ADMIN").optional(),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password is required"),
});

// User Update Schema
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  image: z.string().url({ message: "Invalid image URL" }).optional(),
});

// Password Reset Schema
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Type exports for TypeScript
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
