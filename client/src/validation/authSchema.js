import { z } from "zod";

// Schema for Login
export const loginSchema = z.object({
  emailId: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for Registration
export const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    emailId: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // sets the error specifically on the confirmPassword field
  });
