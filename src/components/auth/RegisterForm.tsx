// src/components/auth/RegisterForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputField } from "./FormFields/InputField";
import { SelectField } from "./FormFields/SelectField";
import { validateForm } from "@/lib/validation";
import { registerUser } from "@/utils/api";
import { UserFormData, FormErrors, SubmitStatus } from "@/types/auth";

const AREAS_OPTIONS = [
  { value: "Almacen", label: "Almacén" },
  { value: "Compras", label: "Compras" },
  { value: "Sistemas", label: "Sistemas" },
  { value: "Recursos Humanos", label: "Recursos Humanos" },
  { value: "Contabilidad", label: "Contabilidad" },
  { value: "Atención a Clientes", label: "Atención a Clientes" },
  { value: "Marketing", label: "Marketing" },
  { value: "Comercialización", label: "Comercialización" },
  { value: "Prevención y Riesgos", label: "Prevención y Riesgos" },
  { value: "Logística", label: "Logística" },
  { value: "Cuentas por Pagar", label: "Cuentas por Pagar" },
  { value: "Gestión y Desarrollo", label: "Gestión y Desarrollo" },
];

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserFormData>({
    nombres: "",
    apellidos: "",
    email: "",
    area: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleAreaChange = (value: string) => {
    setFormData({ ...formData, area: value });
    if (errors.area) {
      setErrors({ ...errors, area: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await registerUser(formData);
      setSubmitStatus({
        type: "success",
        message: "Registro exitoso! Redirigiendo al login...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Hubo un error al registrar el usuario",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex justify-center">
          Registro de Usuario
        </CardTitle>
        <CardDescription className="flex justify-center">
          Por favor, completa todos los campos para registrarte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitStatus.message && (
          <Alert
            className={`mb-4 ${
              submitStatus.type === "success" ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <AlertDescription>{submitStatus.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="nombres"
            name="nombres"
            label="Nombre(s)"
            required
            value={formData.nombres}
            onChange={handleChange}
            error={errors.nombres}
          />

          <InputField
            id="apellidos"
            name="apellidos"
            label="Apellidos"
            required
            value={formData.apellidos}
            onChange={handleChange}
            error={errors.apellidos}
          />

          <InputField
            id="email"
            name="email"
            label="Correo electrónico"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <SelectField
            id="area"
            label="Área"
            value={formData.area}
            onChange={handleAreaChange}
            error={errors.area}
            options={AREAS_OPTIONS}
          />

          <InputField
            id="password"
            name="password"
            label="Contraseña"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
