"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Component() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    area: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAreaChange = (value: string) => {
    setFormData({ ...formData, area: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    // Aquí puedes agregar la lógica para enviar los datos al servidor
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#ebda16] to-[#549c2c] ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registro de Usuario</CardTitle>
          <CardDescription>
            Por favor, completa todos los campos para registrarte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombres">Nombre(s)</Label>
              <Input
                id="nombres"
                name="nombres"
                required
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellidos">Apellidos</Label>
              <Input
                id="apellidos"
                name="apellidos"
                required
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Área</Label>
              <Select onValueChange={handleAreaChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Almacen">Almacén</SelectItem>
                  <SelectItem value="Compras">Compras</SelectItem>
                  <SelectItem value="Sistemas">Sistemas</SelectItem>
                  <SelectItem value="Recursos Humanos">
                    Recursos Humanos
                  </SelectItem>
                  <SelectItem value="Contabilidad">Contabilidad</SelectItem>
                  <SelectItem value="Atención a Clientes">
                    Atención a Clientes
                  </SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Comercialización">
                    Comercialización
                  </SelectItem>
                  <SelectItem value="Prevención y Riesgos">
                    Prevención y Riesgos
                  </SelectItem>
                  <SelectItem value="Logística">Logística</SelectItem>
                  <SelectItem value="Cuentas por Pagar">
                    Cuentas por Pagar
                  </SelectItem>
                  <SelectItem value="Gestión y Desarrollo">
                    Gestión y Desarrollo
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full">
              Registrarse
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
