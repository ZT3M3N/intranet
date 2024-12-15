// app/api/announcements/[id]/comments/moderate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Announcement } from "@/models/Announcement";
import mongoose from "mongoose";
import { AnnouncementService } from "@/services/announcementService";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pendingComments = await AnnouncementService.getPendingComments(
      params.id
    );
    return NextResponse.json(pendingComments);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener comentarios pendientes" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { commentId, action } = await req.json();

    if (action === "approve") {
      const result = await Announcement.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(params.id),
          "comments._id": new mongoose.Types.ObjectId(commentId),
        },
        {
          $set: {
            "comments.$.approved": true,
            "comments.$.status": "approved",
          },
        },
        { new: true }
      );

      if (!result) {
        return NextResponse.json(
          { error: "Anuncio o comentario no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(result);
    } else if (action === "reject") {
      const result = await Announcement.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(params.id),
          "comments._id": new mongoose.Types.ObjectId(commentId),
        },
        {
          $pull: { comments: { _id: new mongoose.Types.ObjectId(commentId) } },
        },
        { new: true }
      );

      if (!result) {
        return NextResponse.json(
          { error: "Anuncio o comentario no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error("Error en moderación:", error);
    return NextResponse.json(
      { error: "Error al moderar el comentario" },
      { status: 500 }
    );
  }
}
