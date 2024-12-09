"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserForm } from "./UserForm";
import { PasswordVerificationDialog } from "./PasswordVerificationDialog";
import { useToast } from "@/hooks/use-toast";

interface User {
  _id: string;
  nombres: string;
  apellidos: string;
  email: string;
  area: string;
  role: string;
}

interface UserTableProps {
  users: User[];
  onUpdate: (
    id: string,
    data: Partial<User>,
    adminPassword: string
  ) => Promise<void>;
  onDelete: (id: string, adminPassword: string) => Promise<void>;
}

export function UserTable({ users, onUpdate, onDelete }: UserTableProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "update" | "delete";
    data?: Partial<User>;
  } | null>(null);
  const { toast } = useToast();

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdate = async (userData: Partial<User>) => {
    if (!editingUser) return;
    setPendingAction({ type: "update", data: userData });
    setShowPasswordDialog(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingUserId(id);
    setPendingAction({ type: "delete" });
    setShowPasswordDialog(true);
  };

  const handlePasswordVerification = async (password: string) => {
    if (!pendingAction) return;

    try {
      if (pendingAction.type === "update" && editingUser) {
        await onUpdate(editingUser._id, pendingAction.data!, password);
        setEditingUser(null);
        toast({
          title: "Éxito",
          description: "Usuario actualizado correctamente",
        });
      } else if (pendingAction.type === "delete" && deletingUserId) {
        await onDelete(deletingUserId, password);
        toast({
          title: "Éxito",
          description: "Usuario eliminado correctamente",
        });
      }
      setShowPasswordDialog(false);
      setPendingAction(null);
      setDeletingUserId(null);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error en la operación",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      {editingUser && (
        <UserForm
          user={editingUser}
          onSubmit={handleUpdate}
          onCancel={() => setEditingUser(null)}
        />
      )}

      <PasswordVerificationDialog
        isOpen={showPasswordDialog}
        onClose={() => {
          setShowPasswordDialog(false);
          setPendingAction(null);
          setDeletingUserId(null);
        }}
        onConfirm={handlePasswordVerification}
        title={
          pendingAction?.type === "delete"
            ? "Confirmar eliminación"
            : "Confirmar actualización"
        }
        description="Por favor, ingresa tu contraseña de administrador para confirmar esta acción."
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombres</TableHead>
            <TableHead>Apellidos</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.nombres}</TableCell>
              <TableCell>{user.apellidos}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.area}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(user)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user._id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
