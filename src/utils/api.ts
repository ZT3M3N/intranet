// src/utils/api.ts
import { UserFormData } from "@/types/auth";

export async function registerUser(userData: UserFormData) {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en el registro');
  }

  return data;
}