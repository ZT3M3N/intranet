import { NextRequest, NextResponse } from "next/server";
import { AnnouncementService } from "@/services/announcementService";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { comment } = await req.json();
    const result = await AnnouncementService.updateComment(
      params.id,
      params.commentId,
      comment
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Error al actualizar el comentario" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const result = await AnnouncementService.deleteComment(
      params.id,
      params.commentId
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Error al eliminar el comentario" },
      { status: 500 }
    );
  }
}
