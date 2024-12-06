import { NextRequest, NextResponse } from "next/server";
import { AnnouncementService } from "@/services/announcementService";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  console.log("API: Starting to process request");

  try {
    const formData = await req.formData();
    console.log("API: FormData received");

    const author = formData.get("author") as string;
    const content = formData.get("content") as string;
    const mediaFiles = formData.getAll("media");

    console.log("API: Received fields:", { author, content });
    console.log("API: Number of media files:", mediaFiles.length);

    const media = [];
    if (mediaFiles.length > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });

      for (const file of mediaFiles) {
        if (file instanceof File) {
          console.log("API: Processing file:", file.name, file.type);

          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const filename = `${Date.now()}-${file.name}`;
          const filepath = path.join(uploadDir, filename);

          await writeFile(filepath, buffer);
          console.log("API: File saved to:", filepath);

          media.push({
            type: file.type,
            url: `/uploads/${filename}`,
            filename: filename,
          });

          console.log("API: Media entry created:", media[media.length - 1]);
        }
      }
    }

    const announcementData = {
      author,
      content,
      media: media.length > 0 ? media : undefined,
      avatar:
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    };

    console.log("API: Creating announcement with data:", announcementData);

    const announcement = await AnnouncementService.createAnnouncement(
      announcementData
    );
    console.log("API: Announcement created:", announcement);

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("API: Error:", error);
    return NextResponse.json(
      { error: "Error al crear el anuncio" },
      { status: 500 }
    );
  }
}

// Configurar el tamaño máximo de la carga
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export async function GET() {
  try {
    const announcements = await AnnouncementService.getAllAnnouncements();
    return NextResponse.json(announcements);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error fetching announcements" },
      { status: 500 }
    );
  }
}
