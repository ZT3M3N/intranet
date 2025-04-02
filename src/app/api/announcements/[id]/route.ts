// src/app/api/announcements/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AnnouncementService } from "@/services/announcementService";
import { connectDB } from "@/lib/mongodb";
import { Announcement } from "@/models/Announcement";
import { uploadFiles } from "@/utils/uploadHelper";

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
    // Verificar el tipo de contenido
    const contentType = req.headers.get("content-type") || "";

    // Si es JSON, estamos actualizando un comentario
    if (contentType.includes("application/json")) {
      return handleCommentUpdate(req, params.id);
    } 
    // Si es multipart/form-data, estamos actualizando el anuncio
    else if (contentType.includes("multipart/form-data")) {
      return handleAnnouncementUpdate(req, params.id);
    }
    
    return NextResponse.json(
      { error: "Tipo de contenido no válido" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error en la solicitud PUT:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}

// Función para manejar la actualización de comentarios
async function handleCommentUpdate(req: NextRequest, announcementId: string) {
  try {
    await connectDB();
    const { commentId, approved } = await req.json();

    const announcement = await Announcement.findOneAndUpdate(
      {
        _id: announcementId,
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

// Función para manejar la actualización de anuncios
async function handleAnnouncementUpdate(req: NextRequest, id: string) {
  try {
    const formData = await req.formData();
    const author = formData.get("author") as string;
    const content = formData.get("content") as string;
    const mediaFiles = formData.getAll("media") as File[];
    const mediaToRemoveJSON = formData.get("mediaToRemove") as string;
    const existingMediaJSON = formData.get("existingMedia") as string;
    
    // Parsear los IDs de media a eliminar
    const mediaToRemove = mediaToRemoveJSON ? JSON.parse(mediaToRemoveJSON) : [];
    
    // Parsear los IDs de media existentes a mantener
    const existingMedia = existingMediaJSON ? JSON.parse(existingMediaJSON) : [];

    // Subir nuevos archivos
    let mediaUploads = [];
    if (mediaFiles.length > 0) {
      mediaUploads = await uploadFiles(mediaFiles);
    }

    // Construir el objeto de actualización
    const updateData = {
      author,
      content,
      updatedAt: new Date(),
    };

    // Actualizar el anuncio
    const updatedAnnouncement = await AnnouncementService.updateAnnouncementWithMedia(
      id,
      updateData,
      mediaUploads,
      mediaToRemove,
      existingMedia
    );

    return NextResponse.json(updatedAnnouncement);
  } catch (error) {
    console.error("Error al actualizar anuncio:", error);
    return NextResponse.json(
      { error: "Error al actualizar el anuncio" },
      { status: 500 }
    );
  }
}
