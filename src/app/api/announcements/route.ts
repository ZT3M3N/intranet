// src/app/api/announcements/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AnnouncementService } from '@/services/announcementService';

export async function GET() {
  try {
    const announcements = await AnnouncementService.getAllAnnouncements();
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching announcements' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await AnnouncementService.createAnnouncement(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating announcement' }, { status: 500 });
  }
}