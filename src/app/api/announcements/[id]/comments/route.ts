// src/app/api/announcements/[id]/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AnnouncementService } from "@/services/announcementService";
import { connectDB } from "@/lib/mongodb";
import { Announcement } from "@/lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const announcement = await Announcement.findById(params.id);
    if (!announcement) {
      return NextResponse.json(
        { error: "Anuncio no encontrado" },
        { status: 404 }
      );
    }

    // Filtrar comentarios pendientes
    const pendingComments = announcement.comments.filter(
      (comment) => comment.status === "pending"
    );

    return NextResponse.json(pendingComments);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return NextResponse.json(
      { error: "Error al obtener comentarios" },
      { status: 500 }
    );
  }
}
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const result = await AnnouncementService.addComment(params.id, body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Error al agregar el comentario" },
      { status: 500 }
    );
  }
}
