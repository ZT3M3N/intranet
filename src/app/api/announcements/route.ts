import { NextRequest, NextResponse } from "next/server";
import { AnnouncementService } from "@/services/announcementService";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extraer datos básicos
    const author = formData.get("author") as string;
    const content = formData.get("content") as string;
    const mediaFiles = formData.getAll("media");

    if (!author || !content) {
      return NextResponse.json(
        { error: "Autor y contenido son requeridos" },
        { status: 400 }
      );
    }

    const media = [];

    // Asegurar que existe el directorio de uploads
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    // Procesar archivos
    for (const file of mediaFiles) {
      if (file instanceof File) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${Date.now()}-${file.name.replace(
          /[^a-zA-Z0-9.-]/g,
          ""
        )}`;
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);

        media.push({
          type: file.type,
          url: `/uploads/${filename}`,
          filename: filename,
        });
      }
    }

    // Crear el anuncio
    const announcement = await AnnouncementService.createAnnouncement({
      author,
      content,
      media,
      avatar: "/images/placeholder.svg", // Asegúrate de que este archivo exista en public/images/
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Error creating announcement:", error);
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
