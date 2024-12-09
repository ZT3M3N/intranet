import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/services/userService";

export async function GET() {
  try {
    const users = await UserService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}
