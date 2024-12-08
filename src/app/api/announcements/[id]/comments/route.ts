// src/app/api/announcements/[id]/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AnnouncementService } from "@/services/announcementService";

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
