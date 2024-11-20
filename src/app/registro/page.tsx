// src/app/register/page.tsx
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#ebda16] to-[#549c2c]">
      <RegisterForm />
    </div>
  );
}