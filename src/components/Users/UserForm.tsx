import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useState } from "react";

interface UserFormProps {
  user?: {
    nombres: string;
    apellidos: string;
    email: string;
    area: string;
    role: string;
  };
  onSubmit: (data: {
    nombres: string;
    apellidos: string;
    email: string;
    area: string;
    role: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    nombres: user?.nombres || "",
    apellidos: user?.apellidos || "",
    email: user?.email || "",
    area: user?.area || "",
    role: user?.role || "user",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={formData.nombres}
        onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
        placeholder="Nombres"
      />
      <Input
        value={formData.apellidos}
        onChange={(e) =>
          setFormData({ ...formData, apellidos: e.target.value })
        }
        placeholder="Apellidos"
      />
      <Input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
      <Input
        value={formData.area}
        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
        placeholder="Área"
      />
      <Select
        value={formData.role}
        onValueChange={(value) => setFormData({ ...formData, role: value })}
      >
        <option value="user">Usuario</option>
        <option value="admin">Administrador</option>
      </Select>
      <div className="flex gap-2">
        <Button type="submit">Guardar</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
