// src/app/api/announcements/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AnnouncementService } from "@/services/announcementService";
import { connectDB } from "@/lib/mongodb";
import { Announcement } from "@/models/Announcement";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await AnnouncementService.deleteAnnouncement(params.id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting announcement" },
      { status: 500 }
    );
  }
}

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

    // Filtrar comentarios pendientes (no aprobados)
    const pendingComments = announcement.comments.filter(
      (comment: any) => !comment.approved
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { commentId, approved } = await req.json();

    const announcement = await Announcement.findOneAndUpdate(
      {
        _id: params.id,
        "comments._id": commentId,
      },
      {
        $set: { "comments.$.approved": approved },
      },
      { new: true }
    );

    if (!announcement) {
      return NextResponse.json(
        { error: "Anuncio o comentario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Comentario actualizado correctamente",
      announcement,
    });
  } catch (error) {
    console.error("Error al actualizar comentario:", error);
    return NextResponse.json(
      { error: "Error al actualizar comentario" },
      { status: 500 }
    );
  }
}
