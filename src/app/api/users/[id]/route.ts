import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/services/userService";
import { compare } from "bcryptjs";
import { User } from "@/models/User";

async function verifyAdminPassword(password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    throw new Error("Error de configuración del servidor");
  }

  const admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    throw new Error("Error de autenticación");
  }

  const isValid = await compare(password, admin.password);
  if (!isValid) {
    throw new Error("Contraseña incorrecta");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { adminPassword, ...userData } = await req.json();

    // Verificar la contraseña del administrador
    await verifyAdminPassword(adminPassword);

    const user = await UserService.updateUser(params.id, userData);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al actualizar usuario",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { adminPassword } = await req.json();

    // Verificar la contraseña del administrador
    await verifyAdminPassword(adminPassword);

    await UserService.deleteUser(params.id);
    return NextResponse.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error al eliminar usuario",
      },
      { status: 500 }
    );
  }
}
