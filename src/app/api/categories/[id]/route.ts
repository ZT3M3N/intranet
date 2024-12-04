import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { Document } from "@/models/Document";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Verificar si hay documentos usando esta categoría
    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    const documentsUsingCategory = await Document.countDocuments({
      category: category.name,
    });

    if (documentsUsingCategory > 0) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar la categoría porque hay documentos que la están usando",
          documentsCount: documentsUsingCategory,
        },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: "Categoría eliminada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    return NextResponse.json(
      { error: "Error al eliminar la categoría" },
      { status: 500 }
    );
  }
}
