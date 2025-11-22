// Mock authentication API
import { mockUser } from "./mockData";
import type { User } from "@/types";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export const authApi = {
  // Login
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await delay(800);
    
    // Mock validation
    if (credentials.email === "john.doe@stockmaster.com" && credentials.password === "password") {
      return {
        user: mockUser,
        token: "mock-jwt-token-12345",
      };
    }
    
    throw new Error("Invalid email or password");
  },

  // Signup
  async signup(data: SignupData): Promise<{ message: string }> {
    await delay(1000);
    
    // Mock validation
    if (data.email === "john.doe@stockmaster.com") {
      throw new Error("Email already exists");
    }
    
    return {
      message: "Account created successfully. Please login.",
    };
  },

  // Forgot Password - Send OTP
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    await delay(800);
    
    return {
      message: "OTP sent to your email",
    };
  },

  // Reset Password with OTP
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    await delay(1000);
    
    // Mock OTP validation
    if (data.otp !== "123456") {
      throw new Error("Invalid OTP");
    }
    
    return {
      message: "Password reset successfully",
    };
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    await delay(300);
    return mockUser;
  },

  // Logout
  async logout(): Promise<void> {
    await delay(200);
    // Clear token from storage in real implementation
  },
};
