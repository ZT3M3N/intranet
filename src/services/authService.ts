// src/services/authService.ts
import { LoginFormData, LoginResponse } from "@/types/auth";

export async function loginUser(credentials: LoginFormData): Promise<LoginResponse> {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la autenticación');
    }

    return data;
  } catch (error) {
    throw error;
  }
}