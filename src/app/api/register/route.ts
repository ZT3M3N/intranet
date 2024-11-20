import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { hash } from "bcryptjs";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const { nombres, apellidos, email, area, password } = await request.json();

    // Validar que todos los campos requeridos estén presentes
    if (!nombres || !apellidos || !email || !area || !password) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await connectDB();

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: "El correo electrónico ya está registrado" },
        { status: 400 }
      );
    }

    // Encriptar la contraseña
    const hashedPassword = await hash(password, 12);

    // Crear el nuevo usuario
    const user = await User.create({
      nombres,
      apellidos,
      email,
      area,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Usuario registrado exitosamente", user: { 
        id: user._id,
        email: user.email,
        nombres: user.nombres,
        apellidos: user.apellidos,
        area: user.area
      }},
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en el registro:", error);
    return NextResponse.json(
      { message: "Error al registrar el usuario" },
      { status: 500 }
    );
  }
}