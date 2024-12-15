// app/api/announcements/[id]/comments/[commentId]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Announcement } from "@/models/Announcement";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    await connectDB();

    const result = await Announcement.findOneAndUpdate(
      {
        _id: params.id,
        "comments._id": params.commentId,
      },
      {
        $set: {
          "comments.$.approved": true,
        },
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Comentario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error al aprobar comentario:", error);
    return NextResponse.json(
      { error: "Error al aprobar el comentario" },
      { status: 500 }
    );
  }
}
