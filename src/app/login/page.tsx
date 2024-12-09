"use client";

import isopo from "@/assets/isotipo.png";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { loginUser } from "@/services/authService";
import { LoginFormData } from "@/types/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, ingresa un email válido.");
      return false;
    }

    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser(formData);

      if (response.success) {
        // Aquí podrías guardar el token/usuario en localStorage o en un estado global
        localStorage.setItem("user", JSON.stringify(response.user));
        router.push("/admin-dashboard");
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al iniciar sesión"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ebda16] to-[#549c2c] p-4 flex flex-col items-center justify-center">
      <Link href="/" className="mb-8 transition-transform hover:scale-105">
        <Image
          src={isopo}
          alt="Mascota de la intranet"
          width={100}
          height={100}
          className="w-auto h-auto"
        />
      </Link>

      <div className="w-full max-w-xl grid gap-6 animate-title">
        <Card className="w-full bg-gradient-to-br from-indigo-100 to-purple-100">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-center">
              Inicia sesión para acceder a la Intranet
            </CardTitle>
            <CardDescription className="py-2 text-center text-black">
              Ingresa tus credenciales para acceder como administrador.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold">
                    Usuario
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-bold">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {error && (
                <Alert
                  variant="destructive"
                  className="mt-4"
                  aria-live="assertive"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full mt-6 bg-[#ebda16] hover:bg-[#d1c214] text-black"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* <Card className="w-full flex flex-col justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
          <CardFooter className="flex flex-col space-y-4">
            <CardTitle className="text-2xl font-bold text-center">
              O accede como invitado
            </CardTitle>
            <CardDescription className="py-2 text-center text-black">
              Puedes ingresar como invitado para poder visualizar el contenido
              de la intranet.
            </CardDescription>
            <Button
              variant="secondary"
              className="w-full bg-[#549c2c] hover:bg-[#488526] text-black"
              onClick={handleGuestAccess}
            >
              Inicia como invitado
            </Button>
          </CardFooter>
        </Card> */}
      </div>
    </div>
  );
}
