// src/app/api/announcements/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AnnouncementService } from '@/services/announcementService';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await AnnouncementService.deleteAnnouncement(params.id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting announcement' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const result = await AnnouncementService.updateAnnouncement(params.id, body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating announcement' }, { status: 500 });
  }
}