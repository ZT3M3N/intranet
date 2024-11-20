// src/lib/validation.ts
import { UserFormData, FormErrors } from "@/types/auth";

export const validateForm = (formData: UserFormData): FormErrors => {
  const errors: FormErrors = {};

  if (formData.nombres.length < 2) {
    errors.nombres = "El nombre debe tener al menos 2 caracteres";
  }

  if (formData.apellidos.length < 2) {
    errors.apellidos = "Los apellidos deben tener al menos 2 caracteres";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    errors.email = "Por favor ingresa un email válido";
  }

  if (!formData.area) {
    errors.area = "Por favor selecciona un área";
  }

  if (formData.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  return errors;
};