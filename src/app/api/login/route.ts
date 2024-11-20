// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { compare } from "bcryptjs";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validar campos requeridos
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await connectDB();

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // Crear objeto de usuario sin datos sensibles
    const userResponse = {
      id: user._id,
      email: user.email,
      nombres: user.nombres,
      apellidos: user.apellidos,
      area: user.area,
      role: "admin" // Puedes agregar roles en tu modelo de usuario si lo necesitas
    };

    return NextResponse.json(
      {
        success: true,
        message: "Inicio de sesión exitoso",
        user: userResponse
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en el login:", error);
    return NextResponse.json(
      { success: false, message: "Error en el servidor" },
      { status: 500 }
    );
  }
}