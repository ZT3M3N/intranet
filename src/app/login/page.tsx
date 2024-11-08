"use client";

import isopo from "@/assets/isotipo.png"
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the sign-in logic
    // For this example, we'll just simulate a successful login
    if (email && password) {
      router.push("/dashboard");
    } else {
      setError("Please enter both email and password.");
    }
  };

  const handleGuestAccess = () => {
    // Here you would handle guest access logic
    router.push("/guest-dashboard");
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
        
        <div className="w-full max-w-5xl grid gap-6 lg:grid-cols-2 animate-title">
          {/* Formulario 1 */}
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
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-bold">
                      Contraseña
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full mt-6 bg-[#ebda16] hover:bg-[#d1c214] text-black"
                >
                  Iniciar sesión
                </Button>
                <div className="text-sm text-center text-black font-semibold mt-2">
                  ¿Aún no tienes con una cuenta?{" "}
                  <Link
                    href="/signup"
                    className="text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Regístrate
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
          {/* Formulario 2 */}
          <Card className="w-full flex flex-col justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
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
          </Card>
        </div>
      </div>
  );
}
