// src/types/auth.ts
export interface UserFormData {
    nombres: string;
    apellidos: string;
    email: string;
    area: string;
    password: string;
  }
  
  export interface FormErrors {
    nombres?: string;
    apellidos?: string;
    email?: string;
    area?: string;
    password?: string;
  }
  
  export interface SubmitStatus {
    type: "" | "success" | "error";
    message: string;
  }
  
  export interface InputFieldProps {
    id: string;
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    error?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export interface SelectFieldProps {
    id: string;
    label: string;
    value: string;
    error?: string;
    options: { value: string; label: string; }[];
    onChange: (value: string) => void;
  }

  export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    success: boolean;
    message: string;
    user?: {
      id: string;
      email: string;
      nombres: string;
      apellidos: string;
      area: string;
      role: string;
    };
  }